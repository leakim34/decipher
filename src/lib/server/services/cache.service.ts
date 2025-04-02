import { createClient } from 'redis';
import { REDIS_URL, REDIS_CACHE_EXPIRATION } from '$env/static/private';

interface CachedAnalysisResult {
  applicationId: string;
  explanation: string;
  basicOverview: string;
  detailedAnalysis: string;
  timestamp: number;
}

/**
 * Cache service for Algorand application analysis results
 * Falls back to in-memory cache if Redis is unavailable
 */
export class CacheService {
  private static instance: CacheService;
  private client: ReturnType<typeof createClient> | null = null;
  private cacheExpiration: number;
  private isConnected = false;
  private memoryCache: Map<string, CachedAnalysisResult> = new Map();
  private useMemoryFallback = true; // Default to memory fallback until Redis is confirmed working
  private initializationPromise: Promise<void> | null = null;
  
  private constructor() {
    // Set cache expiration from environment or default to 24 hours
    this.cacheExpiration = REDIS_CACHE_EXPIRATION ? 
      parseInt(REDIS_CACHE_EXPIRATION, 10) : 
      24 * 60 * 60; // 24 hours in seconds
  }
  
  /**
   * Initialize Redis connection - only called once
   */
  private async init(): Promise<void> {
    // If initialization is already in progress, return the existing promise
    if (this.initializationPromise) {
      return this.initializationPromise;
    }
    
    // Create a new initialization promise
    this.initializationPromise = this._initializeRedis();
    return this.initializationPromise;
  }
  
  /**
   * Internal Redis initialization method
   */
  private async _initializeRedis(): Promise<void> {
    console.log('Initializing Redis connection...');
    
    try {
      // Create Redis client
      this.client = createClient({
        url: REDIS_URL || 'redis://localhost:6379',
        socket: {
          reconnectStrategy: false // Disable automatic reconnection
        }
      });
      
      // Setup event handlers
      // @ts-ignore - TypeScript doesn't recognize the on method but it exists
      this.client.on('error', (err) => {
        console.error('Redis client error:', err);
        // Mark as using memory fallback if we encounter errors
        this.useMemoryFallback = true;
      });
      
      // @ts-ignore - TypeScript doesn't recognize the on method but it exists
      this.client.on('connect', () => {
        console.log('Connected to Redis successfully');
        this.isConnected = true;
        this.useMemoryFallback = false;
      });
      
      // Try to connect with a timeout
      const connectPromise = this.client.connect();
      
      // Set a timeout to avoid waiting too long
      const timeoutPromise = new Promise<void>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Redis connection timeout after 2000ms'));
        }, 2000);
      });
      
      // Race the connection against the timeout
      await Promise.race([connectPromise, timeoutPromise]);
      
      console.log('Redis initialization completed');
    } catch (error) {
      console.error('Failed to initialize Redis client:', error);
      console.log('Using in-memory cache instead');
      this.useMemoryFallback = true;
      
      // Don't rethrow the error, just fall back to memory cache
    }
  }
  
  /**
   * Get singleton instance of the cache service
   */
  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
      // Start initialization in the background
      setTimeout(() => {
        CacheService.instance.init().catch(err => {
          console.error('Background Redis initialization failed:', err);
        });
      }, 0);
    }
    return CacheService.instance;
  }
  
  /**
   * Get cached analysis for an application ID
   */
  public async getCachedAnalysis(applicationId: string): Promise<CachedAnalysisResult | null> {
    // If not already initialized and not using memory fallback, initialize
    if (!this.initializationPromise && !this.useMemoryFallback) {
      await this.init();
    }
    
    // Use memory cache if Redis is not available or has errors
    if (this.useMemoryFallback) {
      return this.memoryCache.get(applicationId) || null;
    }
    
    try {
      // Ensure Redis is connected
      if (!this.isConnected || !this.client) {
        return this.memoryCache.get(applicationId) || null;
      }
      
      const key = `analysis:${applicationId}`;
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting analysis from Redis cache:', error);
      // Fall back to memory cache on error
      return this.memoryCache.get(applicationId) || null;
    }
  }
  
  /**
   * Cache analysis result for an application ID
   */
  public async cacheAnalysis(
    applicationId: string, 
    explanation: string, 
    basicOverview: string, 
    detailedAnalysis: string
  ): Promise<void> {
    const data: CachedAnalysisResult = {
      applicationId,
      explanation,
      basicOverview,
      detailedAnalysis,
      timestamp: Date.now()
    };
    
    // Always store in memory cache as backup
    this.memoryCache.set(applicationId, data);
    
    // If not already initialized and not using memory fallback, initialize
    if (!this.initializationPromise && !this.useMemoryFallback) {
      await this.init();
    }
    
    // If using memory fallback, don't try Redis
    if (this.useMemoryFallback) {
      return;
    }
    
    // Check if Redis is connected
    if (!this.isConnected || !this.client) {
      return;
    }
    
    try {
      const key = `analysis:${applicationId}`;
      await this.client.setEx(
        key,
        this.cacheExpiration,
        JSON.stringify(data)
      );
      console.log(`Cached analysis for application ${applicationId} in Redis`);
    } catch (error) {
      console.error('Error caching analysis in Redis:', error);
      // Analysis is already in memory cache as backup
    }
  }
  
  /**
   * Clear cached analysis for an application ID
   */
  public async clearCachedAnalysis(applicationId: string): Promise<void> {
    // Always remove from memory cache
    this.memoryCache.delete(applicationId);
    
    // If using memory fallback, don't try Redis
    if (this.useMemoryFallback) {
      return;
    }
    
    // If not connected to Redis, just return
    if (!this.isConnected || !this.client) {
      return;
    }
    
    try {
      const key = `analysis:${applicationId}`;
      await this.client.del(key);
    } catch (error) {
      console.error('Error clearing cached analysis from Redis:', error);
    }
  }
} 
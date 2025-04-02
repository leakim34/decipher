import type { AIModel, AIModelConfig, AIResponse, AIService, PromptType } from '$shared/types';
import { AIProvider, contractPrompts } from '$shared/types';
import { ClaudeService } from './claude.service';
import { OpenAIService } from './openai.service';
import { GeminiService } from './gemini.service';

/**
 * Default AI model configuration
 */
export const defaultAIConfig: AIModelConfig = {
  provider: AIProvider.Claude,
  model: 'claude-3-opus-20240229',
  maxTokens: 4000,
  temperature: 0.7
};

/**
 * AI Service factory and main interface
 */
export class AIServiceFactory {
  private static instance: AIServiceFactory;
  private serviceMap: Map<AIProvider, AIService> = new Map();
  
  // Private constructor for singleton pattern
  private constructor() {
    this.serviceMap.set(AIProvider.Claude, new ClaudeService());
    this.serviceMap.set(AIProvider.OpenAI, new OpenAIService());
    this.serviceMap.set(AIProvider.Gemini, new GeminiService());
  }
  
  /**
   * Get singleton instance
   */
  public static getInstance(): AIServiceFactory {
    if (!AIServiceFactory.instance) {
      AIServiceFactory.instance = new AIServiceFactory();
    }
    return AIServiceFactory.instance;
  }
  
  /**
   * Get the service implementation for a specific provider
   */
  public getService(provider: AIProvider): AIService {
    const service = this.serviceMap.get(provider);
    
    if (!service) {
      throw new Error(`AI provider ${provider} not supported`);
    }
    
    return service;
  }
  
  /**
   * Get all available models across all providers
   */
  public getAllModels(): AIModel[] {
    const allModels: AIModel[] = [];
    
    this.serviceMap.forEach(service => {
      allModels.push(...service.getAvailableModels());
    });
    
    return allModels;
  }
  
  /**
   * Analyze a smart contract with the specified provider and model
   */
  public async analyzeSmartContract(
    tealCode: string,
    promptType: PromptType = 'standard',
    config: AIModelConfig = defaultAIConfig
  ): Promise<AIResponse> {
    const service = this.getService(config.provider);
    
    // Get the prompt template and substitute the TEAL code
    const promptTemplate = contractPrompts[promptType];
    const prompt = promptTemplate.template.replace('[TEALCODE]', tealCode);
    
    return await service.analyze(prompt, config);
  }
} 
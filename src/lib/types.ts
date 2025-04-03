import type { AIProvider } from '$shared/types';
import type { ApplicationInteraction } from '$lib/client/services/algorand-wallet.service';

/**
 * Analysis form data
 */
export interface AnalysisForm {
  applicationId?: string;
  walletAddress?: string;
  resolvedAddress?: string; // For NFD resolution
  searchType?: 'application' | 'wallet';
  aiProvider?: AIProvider;
  aiModel?: string;
  error?: string;
  success?: boolean;
  explanation?: string;
  basicOverview?: string;
  detailedAnalysis?: string;
  decodedProgram?: string;
  applicationInfo?: any;
  walletInteractions?: ApplicationInteraction[];
  [key: string]: unknown; // Add index signature for Record compatibility
}

/**
 * Cached analysis result
 */
export interface CachedAnalysisResult {
  applicationId: string;
  explanation: string;
  basicOverview: string;
  detailedAnalysis: string;
  timestamp: number;
}

/**
 * Analysis request parameters
 */
export interface AnalysisParams {
  applicationId: string;
  aiProvider?: AIProvider;
  aiModel?: string;
}

/**
 * Wallet search parameters
 */
export interface WalletSearchParams {
  walletAddress: string;
  resolvedAddress?: string;
  limit?: number;
} 
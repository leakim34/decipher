import type { AIProvider } from '$shared/types';

/**
 * Analysis form data
 */
export interface AnalysisForm {
  applicationId?: string;
  aiProvider?: AIProvider;
  aiModel?: string;
  error?: string;
  success?: boolean;
  explanation?: string;
  basicOverview?: string;
  detailedAnalysis?: string;
  decodedProgram?: string;
  applicationInfo?: any;
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
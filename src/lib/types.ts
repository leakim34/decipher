import type { AIProvider, PromptType } from '$shared/types';

/**
 * Analysis form data
 */
export interface AnalysisForm {
  applicationId?: string;
  promptType?: PromptType;
  aiProvider?: AIProvider;
  aiModel?: string;
  error?: string;
  success?: boolean;
  explanation?: string;
  decodedProgram?: string;
  applicationInfo?: any;
  [key: string]: unknown; // Add index signature for Record compatibility
}

/**
 * Analysis request parameters
 */
export interface AnalysisParams {
  applicationId: string;
  promptType: PromptType;
  aiProvider?: AIProvider;
  aiModel?: string;
} 
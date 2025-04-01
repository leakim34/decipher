import type { PromptType } from '$lib/services/claude.server';

/**
 * Analysis form data
 */
export interface AnalysisForm {
  applicationId?: string;
  promptType?: PromptType;
  error?: string;
  success?: boolean;
  explanation?: string;
  decodedProgram?: string;
  applicationInfo?: any;
}

/**
 * Analysis request parameters
 */
export interface AnalysisParams {
  applicationId: string;
  promptType: PromptType;
} 
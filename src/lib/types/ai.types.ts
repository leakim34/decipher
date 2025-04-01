/**
 * AI provider enum (client-side version)
 */
export enum AIProvider {
  Claude = 'claude',
  OpenAI = 'openai',
  Gemini = 'gemini'
}

/**
 * AI model information (client-side version)
 */
export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  description: string;
  capabilities: string[];
}

/**
 * Prompt type for contract analysis
 */
export type PromptType = 'standard' | 'detailed' | 'security' | 'userFriendly';

/**
 * Prompt information with name and description
 */
export interface PromptInfo {
  value: PromptType;
  label: string;
  description: string;
} 
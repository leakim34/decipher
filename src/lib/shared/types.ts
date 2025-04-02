/**
 * AI provider enum
 */
export enum AIProvider {
  Claude = 'claude',
  OpenAI = 'openai',
  Gemini = 'gemini'
}

/**
 * AI model information
 */
export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  description: string;
  maxTokens?: number;  // Optional for client-side
  capabilities: string[];
}

/**
 * Type for prompt template keys
 */
export type PromptType = 'standard' | 'detailed' ;

/**
 * Prompt information with name and description
 */
export interface PromptInfo {
  value: PromptType;
  label: string;
  description: string;
}

/**
 * Contract prompt templates
 */
export interface PromptTemplate {
  name: string;
  description: string;
  template: string;
}

/**
 * Common configuration for AI services
 */
export interface AIModelConfig {
  maxTokens: number;
  temperature?: number;
  provider: AIProvider;
  model: string;
}

/**
 * Response from AI services
 */
export interface AIResponse {
  text: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

/**
 * Base interface for AI service providers
 */
export interface AIService {
  analyze(prompt: string, config: AIModelConfig): Promise<AIResponse>;
  getAvailableModels(): AIModel[];
}

/**
 * Contract prompt templates collection
 */
export const contractPrompts: Record<PromptType, PromptTemplate> = {
  standard: {
    name: 'Standard Analysis',
    description: 'General explanation of the contract\'s purpose and functionality',
    template: `
      You will be provided with TEAL code (Algorand's smart contract language). 
      You'll have to analyse the code.
      Your task is to give a brief explanation of the smart contract.
      Always convert methods and variables sto their human readable form.
      
      Here is the TEAL code:
      [TEALCODE]
      
      Your response should contain:
      - Type of the smart contract
      - Brief explanation of the smart contract
      - Main methods found
      - Any other relevant information
      `,
  },
  detailed: {
    name: 'Detailed Technical Analysis',
    description: 'Detailed technical breakdown of the contract\'s components',
    template: `The following is TEAL code from an Algorand smart contract. Please analyze it thoroughly and provide:

1. A high-level summary of the contract's purpose
2. Key functions and their operations
3. State variables and their significance
4. Access control mechanisms
5. Transaction flow and conditions
6. Any security considerations or potential vulnerabilities
7. Any unusual or notable patterns in the code

TEAL CODE:
[TEALCODE]`
  },
  
};

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
 * AI provider enum
 */
export enum AIProvider {
  Claude = 'claude',
  OpenAI = 'openai',
  Gemini = 'gemini'
}

/**
 * Base interface for AI service providers
 */
export interface AIService {
  analyze(prompt: string, config: AIModelConfig): Promise<AIResponse>;
  getAvailableModels(): AIModel[];
}

/**
 * AI model information
 */
export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  description: string;
  maxTokens: number;
  capabilities: string[];
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
 * Type for prompt template keys
 */
export type PromptType = 'standard' | 'detailed' | 'security' | 'userFriendly';

/**
 * Contract prompt templates collection
 */
export const contractPrompts: Record<PromptType, PromptTemplate> = {
  standard: {
    name: 'Standard Analysis',
    description: 'General explanation of the contract\'s purpose and functionality',
    template: `Analyze the following TEAL smart contract code for the Algorand blockchain and provide a simplified explanation.
TEAL CODE:
[TEALCODE]

Please provide:

1. A brief, non-technical summary of what this contract does (2-3 sentences)
2. The main triggers/conditions that activate this contract
3. Key operations this contract performs
4. Any approval/rejection logic
5. Asset interactions (if applicable)
6. Special conditions or edge cases
7. Any potential security considerations

If you're uncertain about any part of the code or its function, clearly indicate this with [UNCERTAIN: reason for uncertainty].

Avoid technical jargon when possible, and explain any unavoidable technical terms. Focus on helping me understand what this contract would do in practice rather than the programming details.`
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
  security: {
    name: 'Security Assessment',
    description: 'Security-focused assessment highlighting potential risks',
    template: `The following is TEAL code from an Algorand smart contract. Please analyze it from a security perspective and provide:

1. Brief overview of the contract's purpose
2. Assessment of key security risks
3. Identification of potential vulnerabilities
4. Analysis of access control mechanisms
5. Evaluation of input validation
6. Check for reentrancy or logic issues
7. Overall security rating (Low/Medium/High Risk)

TEAL CODE:
[TEALCODE]`
  },
  userFriendly: {
    name: 'Non-Technical Explanation',
    description: 'Simplified explanation for non-technical users',
    template: `The following is TEAL code from an Algorand smart contract. Please analyze it and provide an explanation that would help a non-technical person understand:

1. What does this smart contract do in simple terms?
2. What would someone use this contract for?
3. What happens when someone interacts with this contract?
4. Are there any permissions or restrictions to be aware of?
5. Any potential risks in simple terms?

Please avoid technical jargon when possible and use analogies to explain complex concepts.

TEAL CODE:
[TEALCODE]`
  }
}; 
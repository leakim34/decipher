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
 * Contract prompt template
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
 * Standard contract prompt template
 */
export const contractPrompt: PromptTemplate = {
  name: 'Standard Analysis',
  description: 'Clear explanation of the contract\'s purpose and functionality',
  template: `Analyze accurately this TEAL code (Algorand blockchain smart contract language, assembly like language) and provide TWO separate responses:

### BASIC OVERVIEW
- One-sentence explanation of what this contract does (in plain language for someone with no blockchain knowledge)
- "In other words..." brief explanation (2-3 sentences) that clarifies the purpose using everyday language

### DETAILED ANALYSIS
- Main purpose of the contract
- Key capabilities (3-5 bullet points)
- list of methods available

Please present these two response with this format:
<basic: [BASIC OVERVIEW] >
<detailed: [DETAILED ANALYSIS] >
Do not include any other text or suggestions than the two sections asked.
CODE:
[TEALCODE]
  `,
};

import { CLAUDE_API_KEY } from '$env/static/private';

/**
 * Claude API service configuration
 */
export interface ClaudeConfig {
  model: string;
  maxTokens: number;
}

/**
 * Default Claude API configuration
 */
export const defaultClaudeConfig: ClaudeConfig = {
  model: 'claude-3-opus-20240229',
  maxTokens: 4000
};

/**
 * Contract analysis prompts for different use cases
 */
export const contractPrompts = {
  /**
   * Standard analysis prompt - provides a general explanation
   */
  standard: `The following is TEAL code from an Algorand smart contract. Please analyze it and provide a clear, concise explanation of what this contract does, its purpose, and any notable features or potential concerns a user should be aware of:

{tealCode}`,

  /**
   * Detailed analysis prompt - provides more technical details
   */
  detailed: `The following is TEAL code from an Algorand smart contract. Please analyze it thoroughly and provide:

1. A high-level summary of the contract's purpose
2. Key functions and their operations
3. State variables and their significance
4. Access control mechanisms
5. Transaction flow and conditions
6. Any security considerations or potential vulnerabilities
7. Any unusual or notable patterns in the code

TEAL CODE:
{tealCode}`,

  /**
   * Security-focused analysis - emphasizes risk assessment
   */
  security: `The following is TEAL code from an Algorand smart contract. Please analyze it from a security perspective and provide:

1. Brief overview of the contract's purpose
2. Assessment of key security risks
3. Identification of potential vulnerabilities
4. Analysis of access control mechanisms
5. Evaluation of input validation
6. Check for reentrancy or logic issues
7. Overall security rating (Low/Medium/High Risk)

TEAL CODE:
{tealCode}`,

  /**
   * User-friendly analysis - simplified explanation for non-technical users
   */
  userFriendly: `The following is TEAL code from an Algorand smart contract. Please analyze it and provide an explanation that would help a non-technical person understand:

1. What does this smart contract do in simple terms?
2. What would someone use this contract for?
3. What happens when someone interacts with this contract?
4. Are there any permissions or restrictions to be aware of?
5. Any potential risks in simple terms?

Please avoid technical jargon when possible and use analogies to explain complex concepts.

TEAL CODE:
{tealCode}`
};

/**
 * Type for prompt keys in contractPrompts
 */
export type PromptType = keyof typeof contractPrompts;

/**
 * Sends the TEAL code to Claude API and retrieves a human-readable explanation
 */
export async function analyzeSmartContract(
  tealCode: string, 
  promptType: PromptType = 'standard',
  config: ClaudeConfig = defaultClaudeConfig
): Promise<string> {
  if (!CLAUDE_API_KEY) {
    throw new Error('Claude API key is not configured');
  }

  try {
    // Get the prompt template and substitute the TEAL code
    const promptTemplate = contractPrompts[promptType];
    const prompt = promptTemplate.replace('{tealCode}', tealCode);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: config.maxTokens,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude API error:', errorData);
      throw new Error('Failed to communicate with Claude API');
    }
    
    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error generating explanation:', error);
    throw new Error('Failed to generate explanation');
  }
} 
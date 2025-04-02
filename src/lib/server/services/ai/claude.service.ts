import { CLAUDE_API_KEY } from '$env/static/private';
import type { AIModel, AIModelConfig, AIResponse, AIService } from '$shared/types';
import { AIProvider } from '$shared/types';

/**
 * Claude AI service implementation
 */
export class ClaudeService implements AIService {
  /**
   * Available Claude models
   */
  private readonly models: AIModel[] = [
    {
      id: 'claude-3-opus-20240229',
      name: 'Claude 3 Opus',
      provider: AIProvider.Claude,
      description: 'Most powerful Claude model for complex tasks',
      maxTokens: 4000,
      capabilities: ['Smart contract analysis', 'Code reasoning', 'Complex logic']
    },
    {
      id: 'claude-3-sonnet-20240229',
      name: 'Claude 3 Sonnet',
      provider: AIProvider.Claude,
      description: 'Balanced performance and speed',
      maxTokens: 4000,
      capabilities: ['Smart contract analysis', 'Code reasoning']
    },
    {
      id: 'claude-3-haiku-20240307',
      name: 'Claude 3 Haiku',
      provider: AIProvider.Claude,
      description: 'Fastest Claude model for simpler tasks',
      maxTokens: 4000,
      capabilities: ['Basic smart contract analysis']
    }
  ];

  /**
   * Analyze a smart contract using Claude
   */
  async analyze(prompt: string, config: AIModelConfig): Promise<AIResponse> {
    if (!CLAUDE_API_KEY) {
      throw new Error('Claude API key is not configured');
    }

    try {
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
          temperature: config.temperature ?? 0.7,
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
        throw new Error(`Failed to communicate with Claude API: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        text: data.content[0].text,
        usage: {
          promptTokens: data.usage?.input_tokens,
          completionTokens: data.usage?.output_tokens,
          totalTokens: data.usage?.input_tokens + data.usage?.output_tokens
        }
      };
    } catch (error) {
      console.error('Error generating explanation with Claude:', error);
      throw new Error('Failed to generate explanation with Claude');
    }
  }

  /**
   * Get available Claude models
   */
  getAvailableModels(): AIModel[] {
    return this.models;
  }
} 
import { OPENAI_API_KEY } from '$env/static/private';
import type { AIModel, AIModelConfig, AIResponse, AIService } from './types';
import { AIProvider } from './types';

/**
 * OpenAI service implementation
 */
export class OpenAIService implements AIService {
  /**
   * Available OpenAI models
   */
  private readonly models: AIModel[] = [
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      provider: AIProvider.OpenAI,
      description: 'Most capable GPT-4 model, with vision',
      maxTokens: 4000,
      capabilities: ['Smart contract analysis', 'Code reasoning', 'Complex logic']
    },
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: AIProvider.OpenAI,
      description: 'Fast and powerful model',
      maxTokens: 4000,
      capabilities: ['Smart contract analysis', 'Code reasoning']
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      provider: AIProvider.OpenAI,
      description: 'Fastest GPT model for simpler tasks',
      maxTokens: 4000,
      capabilities: ['Basic smart contract analysis']
    }
  ];

  /**
   * Analyze a smart contract using OpenAI
   */
  async analyze(prompt: string, config: AIModelConfig): Promise<AIResponse> {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
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
        console.error('OpenAI API error:', errorData);
        throw new Error(`Failed to communicate with OpenAI API: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        text: data.choices[0].message.content,
        usage: {
          promptTokens: data.usage?.prompt_tokens,
          completionTokens: data.usage?.completion_tokens,
          totalTokens: data.usage?.total_tokens
        }
      };
    } catch (error) {
      console.error('Error generating explanation with OpenAI:', error);
      throw new Error('Failed to generate explanation with OpenAI');
    }
  }

  /**
   * Get available OpenAI models
   */
  getAvailableModels(): AIModel[] {
    return this.models;
  }
} 
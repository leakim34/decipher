import { GEMINI_API_KEY } from '$env/static/private';
import type { AIModel, AIModelConfig, AIResponse, AIService } from '$shared/types';
import { AIProvider } from '$shared/types';

/**
 * Gemini AI service implementation
 */
export class GeminiService implements AIService {
  /**
   * Available Gemini models
   */
  private readonly models: AIModel[] = [
    {
      id: 'gemini-1.5-pro',
      name: 'Gemini 1.5 Pro',
      provider: AIProvider.Gemini,
      description: 'Most powerful Gemini model',
      maxTokens: 4000,
      capabilities: ['Smart contract analysis', 'Code reasoning', 'Complex logic']
    },
    {
      id: 'gemini-1.5-flash',
      name: 'Gemini 1.5 Flash',
      provider: AIProvider.Gemini,
      description: 'Fastest Gemini model',
      maxTokens: 4000,
      capabilities: ['Basic smart contract analysis']
    }
  ];

  /**
   * Analyze a smart contract using Gemini
   */
  async analyze(prompt: string, config: AIModelConfig): Promise<AIResponse> {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: config.maxTokens,
            temperature: config.temperature ?? 0.7
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error:', errorData);
        throw new Error(`Failed to communicate with Gemini API: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        text: data.candidates[0].content.parts[0].text,
        usage: {
          // Note: Gemini API doesn't currently provide detailed token usage
          totalTokens: data.usageMetadata?.totalTokenCount
        }
      };
    } catch (error) {
      console.error('Error generating explanation with Gemini:', error);
      throw new Error('Failed to generate explanation with Gemini');
    }
  }

  /**
   * Get available Gemini models
   */
  getAvailableModels(): AIModel[] {
    return this.models;
  }
} 
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getApplicationTEAL, validateApplicationId } from '$lib/server/services/algorand.service';
import { AIServiceFactory, defaultAIConfig } from '$lib/server/services/ai/ai.service';
import type { AIModelConfig } from '$shared/types';
import { AIProvider as ServerAIProvider } from '$shared/types';
import type { AnalysisForm } from '$lib/types';
import type { AIModel, PromptType } from '$shared/types';
import { AIProvider } from '$shared/types';

// Map server-side provider to client-side provider
function mapProviderToClient(provider: ServerAIProvider): AIProvider {
  switch (provider) {
    case ServerAIProvider.Claude:
      return AIProvider.Claude;
    case ServerAIProvider.OpenAI:
      return AIProvider.OpenAI;
    case ServerAIProvider.Gemini:
      return AIProvider.Gemini;
    default:
      return AIProvider.Claude;
  }
}

// Map client-side provider to server-side provider
function mapProviderToServer(provider: AIProvider): ServerAIProvider {
  switch (provider) {
    case AIProvider.Claude:
      return ServerAIProvider.Claude;
    case AIProvider.OpenAI:
      return ServerAIProvider.OpenAI;
    case AIProvider.Gemini:
      return ServerAIProvider.Gemini;
    default:
      return ServerAIProvider.Claude;
  }
}

/**
 * Load data for the page
 */
export const load: PageServerLoad = async () => {
  // Initialize AI service factory
  const aiServiceFactory = AIServiceFactory.getInstance();
  
  // Get all AI models from server and transform to client models
  const serverModels = aiServiceFactory.getAllModels();
  const clientModels: AIModel[] = serverModels.map(model => ({
    id: model.id,
    name: model.name,
    provider: mapProviderToClient(model.provider),
    description: model.description,
    capabilities: model.capabilities
  }));
  
  // Define available prompt types with descriptions
  const promptTypes = [
    { 
      value: 'standard' as PromptType, 
      label: 'For Everyone',
      description: 'Clear, jargon-free explanation of what this smart contract does in everyday terms'
    },
    { 
      value: 'detailed' as PromptType, 
      label: 'For Developers',
      description: 'Detailed technical breakdown'
    }

  ];
  
  // Return data for the client
  return {
    aiModels: clientModels,
    promptTypes,
    defaultConfig: {
      provider: mapProviderToClient(defaultAIConfig.provider),
      model: defaultAIConfig.model
    }
  };
};

/**
 * Server-side actions for the page
 */
export const actions: Actions = {
  /**
   * Analyze an Algorand smart contract
   */
  analyze: async ({ request }) => {
    console.log('Starting contract analysis...');
    const formData = await request.formData();
    const applicationId = formData.get('applicationId')?.toString() || '';
    const promptType = (formData.get('promptType')?.toString() || 'standard') as PromptType;
    
    // Get AI configuration from form data
    const clientAiProvider = formData.get('aiProvider')?.toString() || AIProvider.Claude;
    const aiModel = formData.get('aiModel')?.toString() || defaultAIConfig.model;
    
    // Map client provider to server provider
    const serverAiProvider = mapProviderToServer(clientAiProvider as AIProvider);
    
    const aiConfig: AIModelConfig = {
      provider: serverAiProvider,
      model: aiModel,
      maxTokens: 4000,
      temperature: 0.7
    };
    
    console.log('Analysis request:', { applicationId, promptType, provider: serverAiProvider, model: aiModel });

    // Validate application ID
    if (!validateApplicationId(applicationId)) {
      console.warn('Invalid application ID format:', applicationId);
      return fail(400, {
        error: 'Invalid application ID format',
        applicationId,
        promptType,
        aiProvider: clientAiProvider,
        aiModel
      });
    }

    try {
      // Get the TEAL code for the application
      console.log('Fetching and disassembling TEAL code...');
      const decodedProgram = await getApplicationTEAL(applicationId);
      
      // Initialize AI service factory
      const aiServiceFactory = AIServiceFactory.getInstance();
      
      // Analyze the smart contract using selected AI provider
      console.log(`Analyzing with ${serverAiProvider}/${aiModel}, prompt type: ${promptType}`);
      const analysis = await aiServiceFactory.analyzeSmartContract(decodedProgram, promptType, aiConfig);
      console.log('Successfully generated explanation');
      
      return {
        success: true,
        applicationId,
        promptType,
        aiProvider: clientAiProvider,
        aiModel,
        decodedProgram,
        explanation: analysis.text
      } as AnalysisForm;
    } catch (error) {
      console.error('Error analyzing contract:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        applicationId,
        promptType,
        aiProvider: clientAiProvider,
        aiModel,
        stack: error instanceof Error ? error.stack : undefined
      });
      
      return fail(500, {
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        applicationId,
        promptType,
        aiProvider: clientAiProvider,
        aiModel
      } as AnalysisForm);
    }
  }
}; 
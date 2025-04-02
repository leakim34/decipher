import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getApplicationTEAL, validateApplicationId } from '$lib/server/services/algorand.service';
import { AIServiceFactory, defaultAIConfig } from '$lib/server/services/ai/ai.service';
import type { AnalysisForm } from '$lib/types';
import { CacheService } from '$lib/server/services/cache.service';

// Initialize cache service early, before any requests come in
const cacheService = CacheService.getInstance();

/**
 * Load data for the page
 */
export const load: PageServerLoad = async () => {
  // No data needed for the client now
  return {};
};

/**
 * Parse the AI response to extract basic overview and detailed analysis
 */
function parseAnalysisResponse(text: string): { basicOverview: string; detailedAnalysis: string } {
  // Default values in case parsing fails
  let basicOverview = '';
  let detailedAnalysis = '';
  
  try {
    // Extract content between tags using regex with flexible whitespace handling
    const basicMatch = text.match(/<basic:\s*([\s\S]*?)\s*>/);
    const detailedMatch = text.match(/<detailed:\s*([\s\S]*?)\s*>/);
    
    // Use the matched content or fallback to full text
    basicOverview = basicMatch?.[1]?.trim() || text;
    detailedAnalysis = detailedMatch?.[1]?.trim() || '';

  } catch (error) {
    console.warn('Error parsing analysis response:', error);
    // Fall back to the full text
    basicOverview = text;
  }
  
  return { basicOverview, detailedAnalysis };
}

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

    // Validate application ID
    if (!validateApplicationId(applicationId)) {
      console.warn('Invalid application ID format:', applicationId);
      return fail(400, {
        error: 'Invalid application ID format',
        applicationId
      });
    }

    try {
      // Check cache first - no need to initialize here, already done at top level
      const cachedAnalysis = await cacheService.getCachedAnalysis(applicationId);
      
      if (cachedAnalysis) {
        console.log(`Found cached analysis for application ${applicationId}`);
        return {
          success: true,
          applicationId,
          explanation: cachedAnalysis.explanation,
          basicOverview: cachedAnalysis.basicOverview,
          detailedAnalysis: cachedAnalysis.detailedAnalysis
        } as AnalysisForm;
      }
      
      console.log(`No cached analysis found for application ${applicationId}, generating new analysis...`);
      
      // Get the TEAL code for the application
      console.log('Fetching and disassembling TEAL code...');
      const decodedProgram = await getApplicationTEAL(applicationId);
      
      // Initialize AI service factory
      const aiServiceFactory = AIServiceFactory.getInstance();
      
      // Analyze the smart contract using default AI provider
      console.log(`Analyzing with default configuration: ${defaultAIConfig.provider}/${defaultAIConfig.model}`);
      const analysis = await aiServiceFactory.analyzeSmartContract(decodedProgram, defaultAIConfig);
      console.log('Successfully generated explanation');
      
      // Parse the response to extract the sections
      const { basicOverview, detailedAnalysis } = parseAnalysisResponse(analysis.text);
      
      // Cache the analysis result
      await cacheService.cacheAnalysis(
        applicationId,
        analysis.text,
        basicOverview,
        detailedAnalysis
      );
      
      return {
        success: true,
        applicationId,
        decodedProgram,
        explanation: analysis.text,
        basicOverview,
        detailedAnalysis
      } as AnalysisForm;
    } catch (error) {
      console.error('Error analyzing contract:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        applicationId,
        stack: error instanceof Error ? error.stack : undefined
      });
      
      return fail(500, {
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        applicationId
      } as AnalysisForm);
    }
  }
}; 
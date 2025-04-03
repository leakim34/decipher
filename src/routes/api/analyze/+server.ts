import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getApplicationTEAL, validateApplicationId } from '$lib/server/services/algorand.service';
import { AIServiceFactory, defaultAIConfig } from '$lib/server/services/ai/ai.service';
import type { AnalysisForm } from '$lib/types';
import { CacheService } from '$lib/server/services/cache.service';

// Initialize cache service
const cacheService = CacheService.getInstance();

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
 * GET handler for the analyze API
 */
export const GET: RequestHandler = async ({ url }) => {
  const applicationId = url.searchParams.get('applicationId');
  
  if (!applicationId) {
    return json({
      error: 'Missing application ID parameter'
    }, { status: 400 });
  }
  
  // Validate application ID
  if (!validateApplicationId(applicationId)) {
    console.warn('Invalid application ID format:', applicationId);
    return json({
      error: 'Invalid application ID format',
      applicationId
    }, { status: 400 });
  }
  
  try {
    // Check cache first
    const cachedAnalysis = await cacheService.getCachedAnalysis(applicationId);
    
    if (cachedAnalysis) {
      //console.log(`Found cached analysis for application ${applicationId}`);
      return json({
        success: true,
        applicationId,
        explanation: cachedAnalysis.explanation,
        basicOverview: cachedAnalysis.basicOverview,
        detailedAnalysis: cachedAnalysis.detailedAnalysis
      });
    }
    
    //console.log(`No cached analysis found for application ${applicationId}, generating new analysis...`);
    
    // Get the TEAL code for the application
    //console.log('Fetching and disassembling TEAL code...');
    const decodedProgram = await getApplicationTEAL(applicationId);
    
    // Initialize AI service factory
    const aiServiceFactory = AIServiceFactory.getInstance();
    
    // Analyze the smart contract using default AI provider
    //console.log(`Analyzing with default configuration: ${defaultAIConfig.provider}/${defaultAIConfig.model}`);
    const analysis = await aiServiceFactory.analyzeSmartContract(decodedProgram, defaultAIConfig);
    //console.log('Successfully generated explanation');
    
    // Parse the response to extract the sections
    const { basicOverview, detailedAnalysis } = parseAnalysisResponse(analysis.text);
    
    // Cache the analysis result
    await cacheService.cacheAnalysis(
      applicationId,
      analysis.text,
      basicOverview,
      detailedAnalysis
    );
    
    return json({
      success: true,
      applicationId,
      decodedProgram,
      explanation: analysis.text,
      basicOverview,
      detailedAnalysis
    });
  } catch (error) {
    console.error('Error analyzing contract:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      applicationId,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return json({
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      applicationId
    }, { status: 500 });
  }
};

/**
 * POST handler for the analyze API
 */
export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  const applicationId = data.applicationId;
  
  if (!applicationId) {
    return json({
      error: 'Missing application ID parameter'
    }, { status: 400 });
  }
  
  // Validate application ID
  if (!validateApplicationId(applicationId)) {
    console.warn('Invalid application ID format:', applicationId);
    return json({
      error: 'Invalid application ID format',
      applicationId
    }, { status: 400 });
  }
  
  try {
    // Check cache first
    const cachedAnalysis = await cacheService.getCachedAnalysis(applicationId);
    
    if (cachedAnalysis) {
      //console.log(`Found cached analysis for application ${applicationId}`);
      return json({
        success: true,
        applicationId,
        explanation: cachedAnalysis.explanation,
        basicOverview: cachedAnalysis.basicOverview,
        detailedAnalysis: cachedAnalysis.detailedAnalysis
      });
    }
    
    //console.log(`No cached analysis found for application ${applicationId}, generating new analysis...`);
    
    // Get the TEAL code for the application
    //console.log('Fetching and disassembling TEAL code...');
    const decodedProgram = await getApplicationTEAL(applicationId);
    
    // Initialize AI service factory
    const aiServiceFactory = AIServiceFactory.getInstance();
    
    // Analyze the smart contract using default AI provider
    //console.log(`Analyzing with default configuration: ${defaultAIConfig.provider}/${defaultAIConfig.model}`);
    const analysis = await aiServiceFactory.analyzeSmartContract(decodedProgram, defaultAIConfig);
    //console.log('Successfully generated explanation');
    
    // Parse the response to extract the sections
    const { basicOverview, detailedAnalysis } = parseAnalysisResponse(analysis.text);
    
    // Cache the analysis result
    await cacheService.cacheAnalysis(
      applicationId,
      analysis.text,
      basicOverview,
      detailedAnalysis
    );
    
    return json({
      success: true,
      applicationId,
      decodedProgram,
      explanation: analysis.text,
      basicOverview,
      detailedAnalysis
    });
  } catch (error) {
    console.error('Error analyzing contract:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      applicationId,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return json({
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      applicationId
    }, { status: 500 });
  }
};
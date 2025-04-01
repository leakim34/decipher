import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getApplicationTEAL, validateApplicationId } from '$lib/services/algorand.server';
import { analyzeSmartContract, type PromptType } from '$lib/services/claude.server';
import type { AnalysisForm } from '$lib/types';

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
    
    console.log('Analysis request:', { applicationId, promptType });

    // Validate application ID
    if (!validateApplicationId(applicationId)) {
      console.warn('Invalid application ID format:', applicationId);
      return fail(400, {
        error: 'Invalid application ID format',
        applicationId,
        promptType
      });
    }

    try {
      // Get the TEAL code for the application
      console.log('Fetching and disassembling TEAL code...');
      const decodedProgram = await getApplicationTEAL(applicationId);
      
      // Analyze the smart contract using Claude
      console.log(`Analyzing with prompt type: ${promptType}`);
      const explanation = await analyzeSmartContract(decodedProgram, promptType);
      console.log('Successfully generated explanation');
      
      return {
        success: true,
        applicationId,
        promptType,
        decodedProgram,
        explanation
      } as AnalysisForm;
    } catch (error) {
      console.error('Error analyzing contract:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        applicationId,
        promptType,
        stack: error instanceof Error ? error.stack : undefined
      });
      
      return fail(500, {
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        applicationId,
        promptType
      } as AnalysisForm);
    }
  }
}; 
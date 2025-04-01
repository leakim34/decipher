import { fail } from '@sveltejs/kit';
import algosdk from 'algosdk';
import type { Actions } from './$types';
import { Buffer } from 'buffer';
import { ALGOD_URL, INDEXER_URL, CLAUDE_API_KEY } from '$env/static/private';
// Environment variables are accessible server-side


/**
 * Validates the Algorand application ID format
 */
function validateApplicationId(applicationId: string): boolean {
  // Check if the ID is a positive integer
  const parsedId = parseInt(applicationId, 10);
  return !isNaN(parsedId) && parsedId > 0 && parsedId.toString() === applicationId;
}

/**
 * Disassembles TEAL bytecode into human-readable TEAL code
 */
async function disassembleTEAL(base64Program: string): Promise<string> {
  console.log('Disassembling TEAL bytecode...');
  
  try {
    const response = await fetch(`${ALGOD_URL}/v2/teal/disassemble`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-binary'
      },
      body: base64Program
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to disassemble TEAL:', errorText);
      throw new Error(`Failed to disassemble TEAL: ${response.status}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error in TEAL disassembly:', error);
    throw new Error('Failed to disassemble TEAL program');
  }
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
    console.log('Application ID received:', applicationId);

    // Validate application ID
    if (!validateApplicationId(applicationId)) {
      console.warn('Invalid application ID format:', applicationId);
      return fail(400, {
        error: 'Invalid application ID format',
        applicationId
      });
    }

    try {
      // Initialize Algorand indexer client
      console.log('Initializing Algorand indexer client...');
      const indexerClient = new algosdk.Indexer('', INDEXER_URL, 443 );
      
      // Fetch application info
      console.log('Fetching application info for ID:', applicationId);
      const appInfo = await indexerClient.lookupApplications(parseInt(applicationId)).do();
      
      if (!appInfo.application?.params?.approvalProgram) {
        console.warn('Application not found or missing approval program:', applicationId);
        return fail(404, {
          error: 'Application not found or has no approval program',
          applicationId
        });
      }

      // Get approval program
      console.log('Retrieved approval program');
      const approvalProgram = appInfo.application.params.approvalProgram;
      
      // Convert approval program to base64
      console.log('Converting to base64...');
      const base64Program = Buffer.from(approvalProgram, 'base64');
      // Disassemble the TEAL bytecode
      console.log('Disassembling TEAL program...');
      const decodedProgram = await disassembleTEAL(base64Program);
      // Only call Claude API if we have an API key
      if (!CLAUDE_API_KEY) {
        console.warn('No Claude API key configured');
        return {
          success: true,
          applicationId,
          decodedProgram,
          explanation: 'Claude API key not configured. Showing raw TEAL code instead.'
        };
      }
  
      // Call Claude API for explanation
      console.log('Calling Claude API for explanation...');
      const explanation = await getHumanReadableExplanation(decodedProgram);
      console.log('Successfully generated explanation');
      
      return {
        success: true,
        applicationId,
        decodedProgram,
        explanation
      };
    } catch (error) {
      console.error('Error analyzing contract:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        applicationId,
        stack: error instanceof Error ? error.stack : undefined
      });
      return fail(500, {
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        applicationId
      });
    }
  }
};

/**
 * Sends the TEAL code to Claude API and retrieves a human-readable explanation
 */
async function getHumanReadableExplanation(tealCode: string): Promise<string> {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229",
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: `The following is TEAL code from an Algorand smart contract. Please analyze it and provide a clear, concise explanation of what this contract does, its purpose, and any notable features or potential concerns a user should be aware of:\n\n${tealCode}`
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
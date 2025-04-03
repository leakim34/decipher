import algosdk from 'algosdk';
import { PUBLIC_ALGOD_URL, PUBLIC_INDEXER_URL } from '$env/static/public';

/**
 * Validates the Algorand application ID format
 */
export function validateApplicationId(applicationId: string): boolean {
  // Check if the ID is a positive integer
  const parsedId = parseInt(applicationId, 10);
  return !isNaN(parsedId) && parsedId > 0 && parsedId.toString() === applicationId;
}

/**
 * Disassembles TEAL bytecode into human-readable TEAL code
 */
export async function disassembleTEAL(base64Program: string): Promise<string> {
  console.log('Disassembling TEAL bytecode...');
  
  try {
      const response = await fetch(`${PUBLIC_ALGOD_URL}/v2/teal/disassemble`, {
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
 * Fetches application information from the Algorand blockchain
 */
export async function fetchApplicationInfo(applicationId: string) {
  if (!validateApplicationId(applicationId)) {
    throw new Error('Invalid application ID format');
  }

  try {
    // Initialize Algorand indexer client
    console.log('Initializing Algorand indexer client...');
    const indexerClient = new algosdk.Indexer('', PUBLIC_INDEXER_URL, 443);
    
    // Fetch application info
    console.log('Fetching application info for ID:', applicationId);
    const appInfo = await indexerClient.lookupApplications(parseInt(applicationId)).do();
    
    if (!appInfo.application?.params?.approvalProgram) {
      throw new Error('Application not found or has no approval program');
    }
    
    return appInfo;
  } catch (error) {
    console.error('Error fetching application:', error);
    throw error;
  }
}

/**
 * Gets the TEAL source code for an Algorand application
 */
export async function getApplicationTEAL(applicationId: string): Promise<string> {
  try {
    // Fetch application info
    const appInfo = await fetchApplicationInfo(applicationId);
    
    // Get approval program
    const approvalProgram = appInfo.application.params.approvalProgram;
    
    // Convert to Buffer for disassembly
    const buffer = Buffer.from(approvalProgram, 'base64');
    
    // Disassemble the TEAL bytecode
    return await disassembleTEAL(buffer as any);
  } catch (error) {
    console.error('Error getting application TEAL:', error);
    throw error;
  }
} 
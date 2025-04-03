import algosdk from 'algosdk';
import { PUBLIC_ALGOD_URL, PUBLIC_INDEXER_URL } from '$env/static/public';
const indexerClient = new algosdk.Indexer('', PUBLIC_INDEXER_URL, 443);

/**
 * Validates Algorand wallet address format
 */
export function validateWalletAddress(address: string): boolean {
  try {
    return algosdk.isValidAddress(address);
  } catch (error) {
    console.error('Error validating wallet address:', error);
    return false;
  }
}

/**
 * Checks if a string is a potential NFD domain (.algo)
 */
export function isNFDDomain(input: string): boolean {
  return input.endsWith('.algo') && input.length > 5;
}

/**
 * Interface for application interaction type
 */
export interface ApplicationInteraction {
  appId: number;
  timestamp: number; // Unix timestamp
  txId: string;
}

/**
 * Resolve NFD domain to Algorand address
 * Example: 'myalias.algo' -> 'ABCDEF...'
 */
export async function resolveNFDToAddress(nfdDomain: string): Promise<string> {
  try {
    // This would be implemented with NFD API
    // For now, return a mock address for demonstration
    //console.log(`Resolving NFD domain: ${nfdDomain}`);
    
    // Make request to NFD API
    const response = await fetch(`https://api.nf.domains/nfd/${nfdDomain.toLowerCase()}?view=brief&poll=false&nocache=false`, {
      headers: {
        'accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`NFD API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.owner) {
      throw new Error(`No owner found for NFD domain ${nfdDomain}`);
    }

    return data.owner;
    
    // Mock response - in production we'd call the NFD API
    // For example: https://api.nf.domains/nfd/lookup?name=example.algo
    return 'ZZAF5ARA4MEC5NSRJT44LHZ4RK75QBNEFXAR6AYXKVARG6SJDGQJRVZPKA';
  } catch (error) {
    console.error('Error resolving NFD domain:', error);
    throw new Error(`Failed to resolve NFD domain ${nfdDomain}`);
  }
}

/**
 * Process input to get valid Algorand address
 * Handles both direct addresses and NFD domains
 */
export async function processAddressInput(input: string): Promise<string> {
  // Check if input is a valid address
  if (validateWalletAddress(input)) {
    return input;
  }
  
  // Check if input is an NFD domain
  if (isNFDDomain(input)) {
    return await resolveNFDToAddress(input);
  }
  
  // If neither, throw error
  throw new Error('Invalid input: must be a valid Algorand address or .algo domain');
}

/**
 * Fetch recent application interactions for a wallet address
 */
export async function fetchWalletApplicationInteractions(
  address: string,
  limit: number = 100
): Promise<ApplicationInteraction[]> {
  try {
    // Validate address
    if (!validateWalletAddress(address)) {
      throw new Error('Invalid wallet address');
    }
    
    // Fetch transactions from indexer
    //console.log(`Fetching application interactions for wallet: ${address}`);
    const {transactions} = await indexerClient.searchForTransactions().txType('appl').address(address).limit(limit).do();

    // Create a map to track unique app IDs with their first transaction
    const uniqueApps = new Map();
    
    // Only process each app ID once with its first transaction
    for (const tx of transactions) {
      const appId = Number(tx.applicationTransaction.applicationId);
      
      if (!uniqueApps.has(appId)) {
        uniqueApps.set(appId, {
          txId: tx.id,
          appId,
          timestamp: Number(tx.roundTime) * 1000
        });
      }
    }

    // Convert map values to array
    const interactions = Array.from(uniqueApps.values());
    
    //console.log('Unique application interactions:', interactions);
    return interactions;
  } catch (error) {
    console.error('Error fetching wallet interactions:', error);
    throw error;
  }
}

/**
 * Get unique application IDs this wallet has interacted with
 */
export async function getRecentApplications(
  address: string,
  limit: number = 10
): Promise<number[]> {
  try {
    const interactions = await fetchWalletApplicationInteractions(address, limit * 2);
    
    // Extract unique app IDs and sort by most recent
    const uniqueAppIds = Array.from(
      new Map(
        interactions.map(interaction => [interaction.appId, interaction])
      ).values()
    )
    .sort((a, b) => b.timestamp - a.timestamp)
    .map(interaction => interaction.appId)
    .slice(0, limit);
    
    return uniqueAppIds;
  } catch (error) {
    console.error('Error getting recent applications:', error);
    throw error;
  }
} 
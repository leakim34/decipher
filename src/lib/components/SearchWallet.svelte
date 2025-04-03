<script lang="ts">
  import { validateWalletAddress, isNFDDomain, resolveNFDToAddress, fetchWalletApplicationInteractions } from '$lib/client/services/algorand-wallet.service';
  import type { ApplicationInteraction } from '$lib/client/services/algorand-wallet.service';
  import WalletResults from './WalletResults.svelte';
  import { appState } from '$lib/stores/app-state.svelte';
  
  // State
  let walletInput = $state('');
  let validationError = $state('');
  let isSearching = $state(false);
  let resolvedAddress = $state('');
  let walletInteractions = $state<ApplicationInteraction[]>([]);
  let hasSearched = $state(false);
  
  // Validation function
  function validateInput() {
    validationError = '';
    
    const input = walletInput.trim();
    if (!input) {
      validationError = 'Wallet address or NFD domain is required';
      return false;
    }
    
    if (!validateWalletAddress(input) && !isNFDDomain(input)) {
      validationError = 'Enter a valid Algorand address or NFD domain';
      return false;
    }
    
    return true;
  }
  
  // Handle searching for wallet interactions
  async function searchWallet() {
    if (!validateInput()) {
      return;
    }
    
    isSearching = true;
    hasSearched = true;
    
    try {
      // Process input - resolve NFD if needed
      const input = walletInput.trim();
      
      if (validateWalletAddress(input)) {
        resolvedAddress = input;
      } else if (isNFDDomain(input)) {
        resolvedAddress = await resolveNFDToAddress(input);
      }
      console.log('Resolved address:', resolvedAddress);
      // Fetch wallet interactions
      const interactions = await fetchWalletApplicationInteractions(resolvedAddress);
      walletInteractions = interactions;
      
      // Update the app state store
      appState.setWalletData(walletInput, resolvedAddress, interactions);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      validationError = error instanceof Error ? error.message : 'Error fetching wallet data';
      walletInteractions = [];
    } finally {
      isSearching = false;
    }
  }
  

</script>

<div class="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-slate-700">
  <div class="p-6">
    <div class="space-y-6">
      <!-- Wallet Input -->
      <div>
        <label for="walletAddress" class="block text-sm font-medium text-slate-300 mb-2">
          Wallet Address or NFD
        </label>
        <div class="relative">
          <input
            type="text"
            id="walletAddress"
            placeholder="Enter Algorand address or NFD (e.g., example.algo)"
            bind:value={walletInput}
            class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-slate-400"
            disabled={isSearching}
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 5h-7L8.86 2.86a2 2 0 00-1.34-.56H5a2 2 0 00-2 2v12.8a2.09 2.09 0 00.06.5" />
              <path d="M19 14v4a2 2 0 01-2 2H7m5-6l2 2l4-4" />
            </svg>
          </div>
        </div>
        <p class="mt-1 text-xs text-slate-400">
          Enter an Algorand wallet address or NFD domain (e.g., example.algo)
        </p>
      </div>
      
      <!-- Validation error message -->
      {#if validationError}
        <div class="text-red-400 text-sm px-1">
          {validationError}
        </div>
      {/if}
      
      <!-- Search Button -->
      <button
        type="button"
        onclick={searchWallet}
        disabled={isSearching}
        class="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-lg hover:from-emerald-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
      >
        <span class="flex items-center justify-center">
          {#if isSearching}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Searching...
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-3 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
            </svg>
            Find Applications
          {/if}
        </span>
      </button>
    </div>
  </div>
</div>

<!-- Search Results -->
{#if hasSearched}
  <WalletResults
    walletAddress={walletInput}
    resolvedAddress={resolvedAddress !== walletInput ? resolvedAddress : undefined}
    walletInteractions={walletInteractions}
    isLoading={isSearching}
  />
{/if} 
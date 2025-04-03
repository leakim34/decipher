<script lang="ts">
  import type { ApplicationInteraction } from '$lib/client/services/algorand-wallet.service';
  import { PUBLIC_EXPLORER_URL } from '$env/static/public';
  import { appState } from '$lib/stores/app-state.svelte';
  
  let { 
    walletAddress = '',
    resolvedAddress = '',
    walletInteractions = [],
    isLoading = false
  } = $props<{
    walletAddress: string;
    resolvedAddress?: string;
    walletInteractions: ApplicationInteraction[];
    isLoading: boolean;
  }>();
  
  // Update store with wallet data
  $effect(() => {
    if (walletInteractions.length > 0) {
      appState.setWalletData(walletAddress, resolvedAddress, walletInteractions);
    }
  });
  
  // State
  let selectedAppId = $state<number | null>(null);
  
  // Format date from timestamp
  function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }
  
  // Handle row click for selecting app
  function handleRowClick(appId: number) {
    selectedAppId = selectedAppId === appId ? null : appId;
  }
  
  // Function to select an app and switch to the application tab
  function selectAndSwitchToApp(appId: number) {
    // Update application ID in store
    appState.selectApplication(appId);
    
    // Switch to application tab
    appState.switchToApplicationTab();
  }
</script>

<div class="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-slate-700 mt-6">
  <div class="p-6">
    <div class="flex justify-between items-center mb-4 pb-3 border-b border-slate-700">
      <h2 class="text-xl font-semibold text-slate-200">Wallet Application Interactions</h2>
      <a 
        href={`${PUBLIC_EXPLORER_URL}/account/${resolvedAddress || walletAddress}`}
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        View on Allo
      </a>
    </div>
    
    {#if isLoading}
      <div class="flex justify-center items-center py-10">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
      </div>
    {:else if walletInteractions.length === 0}
      <div class="text-center py-10 text-slate-400">
        <p>No application interactions found for this wallet address.</p>
      </div>
    {:else}

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-700">
          <thead>
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">App ID</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">TxID</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700">
            {#each walletInteractions as interaction}
              <tr 
                class={`cursor-pointer ${selectedAppId === interaction.appId ? 'bg-emerald-900/30' : 'hover:bg-slate-700/30'}`}
                onclick={() => handleRowClick(interaction.appId)}
              >
                <td class="px-4 py-3 whitespace-nowrap text-sm text-slate-300">
                  <a href={`${PUBLIC_EXPLORER_URL}/application/${interaction.appId}`} target="_blank" rel="noopener noreferrer" class="text-emerald-500 hover:text-emerald-400">
                    {interaction.appId}
                  </a>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-slate-300">{formatDate(interaction.timestamp)}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-slate-300 flex space-x-3">
                  <a 
                    href={`${PUBLIC_EXPLORER_URL}/tx/${interaction.txId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-emerald-500 hover:text-emerald-400"
                    onclick={(e) => e.stopPropagation()}
                  >
                    View Transaction
                  </a>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-slate-300">
                  <button
                    type="button"
                    class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md shadow-sm transition-colors"
                    onclick={(e) => {
                      e.stopPropagation();
                      selectAndSwitchToApp(interaction.appId);
                    }}
                  >
                    Select
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      
     
    {/if}
  </div>
</div> 
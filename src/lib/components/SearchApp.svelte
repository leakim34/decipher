<script lang="ts">
  import { enhance } from '$app/forms';
  import { startAnimation, stopAnimation } from './MessageAnimation.svelte';
  import { appState } from '$lib/stores/app-state.svelte';
	import type { Snippet } from 'svelte';
  
  let { 
    applicationId = '',
    children
  } = $props<{
    applicationId?: string;
    children: Snippet
  }>();
  
  // State
  let isAnalyzing = $state(false);
  let validationError = $state('');
  
  // Sync with store's selectedApplicationId if available
  $effect(() => {
    if (appState.selectedApplicationId) {
      applicationId = appState.selectedApplicationId;
      validationError = '';
    }
  });
  
  // Form validation
  function validateForm() {
    validationError = '';
    
    if (!applicationId.trim()) {
      validationError = 'Application ID is required';
      return false;
    }
    
    return true;
  }
</script>

<div class="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-slate-700">
  <!-- Input Form -->
  <div class="p-6">
    <form 
      method="POST" 
      action="?/analyze"
      use:enhance={() => {
        if (!validateForm()) {
          return;
        }
        
        isAnalyzing = true;
        startAnimation();
        
        // Update the store with the selected app ID
        appState.selectApplication(applicationId);
        
        return async ({ update }) => {
          await update();
          isAnalyzing = false;
          stopAnimation();
        };
      }}
    >
      <div class="space-y-6">
        <!-- Application ID Input -->
        <div>
          <label for="applicationId" class="block text-sm font-medium text-slate-300 mb-2">
            Application ID
          </label>
          <div class="relative">
            <input
              type="text"
              id="applicationId"
              name="applicationId"
              placeholder="Enter Algorand application ID"
              bind:value={applicationId}
              oninput={() => {
                // Update the store with the input value
                appState.selectedApplicationId = applicationId;
              }}
              class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-slate-400"
              disabled={isAnalyzing}
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <path d="M6 12h4" />
                <path d="M14 12h4" />
                <path d="M10 10v4" />
                <path d="M18 10v4" />
              </svg>
            </div>
          </div>
          <p class="mt-1 text-xs text-slate-400">
            Enter the ID of the Algorand application you want to decipher
          </p>
        </div>
        
        <!-- Hidden search type field -->
        <input type="hidden" name="searchType" value="application" />
        
        <!-- Validation error message -->
        {#if validationError}
          <div class="text-red-400 text-sm px-1">
            {validationError}
          </div>
        {/if}
        
        <!-- Submit Button -->
        <button
          type="submit"
          disabled={isAnalyzing}
          class="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-lg hover:from-emerald-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          <span class="flex items-center justify-center">
            {#if isAnalyzing}
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {@render children?.()}
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-3 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7 9a2 2 0 114 0 2 2 0 01-4 0zm9-2a2 2 0 100-4 2 2 0 000 4zM4 7a2 2 0 100-4 2 2 0 000 4zm0 10a2 2 0 100-4 2 2 0 000 4zm9-2a2 2 0 114 0 2 2 0 01-4 0zm0-10a2 2 0 114 0 2 2 0 01-4 0zM7 15a2 2 0 114 0 2 2 0 01-4 0z" clip-rule="evenodd" />
              </svg>
              Make It Human
            {/if}
          </span>
        </button>
      </div>
    </form>
  </div>
</div> 
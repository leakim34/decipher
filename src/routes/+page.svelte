<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PromptType } from '$lib/services/claude.server';
  import type { AnalysisForm } from '$lib/types';
  
  // Use props to get data from the server
  let { form } = $props<{ form: AnalysisForm | null }>();
  
  // We'll use a simpler state management approach with runes
  let isAnalyzing = $state(false);
  
  // Extract form and result data using derived values
  let formData = $derived<AnalysisForm>(form || {});
  let applicationId = $derived(formData.applicationId || '2289177011');
  let promptType = $derived<PromptType>(formData.promptType || 'standard');
  let error = $derived(formData.error);
  let success = $derived(formData.success);
  let explanation = $derived(formData.explanation);
  let decodedProgram = $derived(formData.decodedProgram);
  
  // Available prompt types
  const promptTypes: Array<{value: PromptType, label: string}> = [
    { value: 'standard', label: 'Standard Analysis' },
    { value: 'detailed', label: 'Detailed Technical Analysis' },
    { value: 'security', label: 'Security Assessment' },
    { value: 'userFriendly', label: 'Non-Technical Explanation' }
  ];
</script>

<div class="min-h-screen bg-gray-100">
  <!-- Header -->
  <div class="py-4 bg-blue-600 text-white">
    <div class="container mx-auto px-4">
      <h1 class="text-2xl font-bold">Algorand Smart Contract Analyzer</h1>
      <p class="text-sm mt-1">Understand Algorand smart contracts in plain language</p>
    </div>
  </div>
  
  <main class="container mx-auto px-4 py-8">
    <!-- Input Form -->
    <div class="max-w-md mx-auto mt-8">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Enter Algorand Application ID</h2>
        
        <form 
          method="POST" 
          action="?/analyze"
          use:enhance={() => {
            isAnalyzing = true;
            
            return async ({ update }) => {
              await update();
              isAnalyzing = false;
            };
          }}
        >
          <div class="mb-4">
            <label for="applicationId" class="block text-sm font-medium text-gray-700 mb-1">
              Application ID
            </label>
            <input
              type="text"
              id="applicationId"
              name="applicationId"
              placeholder="Enter Algorand application ID"
              value={applicationId}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isAnalyzing}
            />
          </div>
          
          <div class="mb-4">
            <label for="promptType" class="block text-sm font-medium text-gray-700 mb-1">
              Analysis Type
            </label>
            <select
              id="promptType"
              name="promptType"
              value={promptType}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isAnalyzing}
            >
              {#each promptTypes as option}
                <option value={option.value}>{option.label}</option>
              {/each}
            </select>
            <p class="mt-1 text-xs text-gray-500">
              {#if promptType === 'standard'}
                General explanation of the contract's purpose and functionality
              {:else if promptType === 'detailed'}
                Detailed technical breakdown of the contract's components
              {:else if promptType === 'security'}
                Security-focused assessment highlighting potential risks
              {:else if promptType === 'userFriendly'}
                Simplified explanation for non-technical users
              {/if}
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isAnalyzing}
            class="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Contract'}
          </button>
        </form>
      </div>
    </div>
    
    <!-- Error Display -->
    {#if error}
      <div class="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md border-l-4 border-red-500">
        <h2 class="text-xl font-semibold mb-2 text-red-600">Error</h2>
        <p class="text-gray-700">{error}</p>
      </div>
    {/if}
    
    <!-- Loading indicator -->
    {#if isAnalyzing}
      <div class="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div class="flex flex-col items-center justify-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p class="text-gray-700">Analyzing smart contract...</p>
        </div>
      </div>
    {/if}
    
    <!-- Results -->
    {#if success && explanation}
      <div class="max-w-2xl mx-auto mt-8">
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Smart Contract Analysis</h2>
            <span class="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
              {promptTypes.find(p => p.value === promptType)?.label || 'Standard Analysis'}
            </span>
          </div>
          <div class="prose max-w-none">
            <p class="whitespace-pre-line">{explanation}</p>
          </div>
        </div>
        
        <!-- Raw TEAL code (collapsible) -->
        {#if decodedProgram}
          <details class="bg-white p-6 rounded-lg shadow-md">
            <summary class="text-lg font-medium cursor-pointer">View Raw TEAL Code</summary>
            <pre class="mt-4 p-4 bg-gray-50 rounded overflow-auto text-sm font-mono">{decodedProgram}</pre>
          </details>
        {/if}
      </div>
    {/if}
  </main>
</div>

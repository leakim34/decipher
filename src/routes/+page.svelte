<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PromptType, AIModel, PromptInfo } from '$lib/types/ai.types';
  import type { AnalysisForm } from '$lib/types';
  import { AIProvider } from '$lib/types/ai.types';
  
  // Use props to get data from the server
  let { form, data } = $props<{ 
    form: AnalysisForm | null;
    data: {
      aiModels: AIModel[];
      promptTypes: PromptInfo[];
      defaultConfig: {
        provider: AIProvider;
        model: string;
      }
    }
  }>();
  
  // We'll use a simpler state management approach with runes
  let isAnalyzing = $state(false);
  let showAdvancedOptions = $state(false);
  
  // Extract form and result data using derived values
  let formData = $derived<AnalysisForm>(form || {});
  let applicationId = $derived(formData.applicationId || '2289177011');
  let promptType = $derived<PromptType>(formData.promptType || 'standard');
  let aiProvider = $derived<AIProvider>(formData.aiProvider || data.defaultConfig.provider);
  let aiModel = $derived(formData.aiModel || data.defaultConfig.model);
  let error = $derived(formData.error);
  let success = $derived(formData.success);
  let explanation = $derived(formData.explanation);
  let decodedProgram = $derived(formData.decodedProgram);
  
  // Get all models from server data
  const allModels = $state(data.aiModels);
  // Filter models by provider
  let availableModels = $derived(allModels.filter((model: AIModel) => model.provider === aiProvider));
  
  // Get prompt types from server data
  const promptTypes = data.promptTypes;
  
  // Available AI providers
  const aiProviders = [
    { value: AIProvider.Claude, label: 'Anthropic Claude' },
    { value: AIProvider.OpenAI, label: 'OpenAI GPT' },
    { value: AIProvider.Gemini, label: 'Google Gemini' }
  ];
  
  // Handle provider change to update available models
  function handleProviderChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    aiProvider = target.value as AIProvider;
    
    // Set first available model for this provider if current one isn't valid
    const modelExists = availableModels.some((m: AIModel) => m.id === aiModel);
    if (!modelExists && availableModels.length > 0) {
      aiModel = availableModels[0].id;
    }
  }
  
  // Toggle advanced options
  function toggleAdvancedOptions() {
    showAdvancedOptions = !showAdvancedOptions;
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100">
  <!-- Header -->
  <div class="py-6 bg-gradient-to-r from-emerald-600 to-teal-500 shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex items-center space-x-3">
        <!-- Blockchain icon -->
        <div class="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 12V8H4v4" />
            <path d="M4 16v-4" />
            <path d="M20 16v-4" />
            <path d="M15 8V4" />
            <path d="M9 8V4" />
            <path d="M9 20v-4" />
            <path d="M15 20v-4" />
            <rect x="4" y="4" width="16" height="4" rx="1" />
            <rect x="4" y="12" width="16" height="4" rx="1" />
            <rect x="4" y="16" width="16" height="4" rx="1" />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Decipher</h1>
          <p class="text-sm opacity-90">Algorand Smart Contract Analyzer</p>
        </div>
      </div>
    </div>
  </div>
  
  <main class="container mx-auto px-4 py-10">
    <div class="max-w-3xl mx-auto">
      <!-- Card Container -->
      <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-slate-700">
        <!-- Input Form -->
        <div class="p-6">
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
            <div class="space-y-6">
              <!-- Application ID -->
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
                    value={applicationId}
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
                  Enter the ID of the Algorand application you want to analyze
                </p>
              </div>
              
              <!-- Analysis Type -->
              <div>
                <label for="promptType" class="block text-sm font-medium text-slate-300 mb-2">
                  Analysis Type
                </label>
                <div class="relative">
                  <select
                    id="promptType"
                    name="promptType"
                    value={promptType}
                    class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white appearance-none"
                    disabled={isAnalyzing}
                  >
                    {#each promptTypes as option}
                      <option value={option.value}>{option.label}</option>
                    {/each}
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p class="mt-1 text-xs text-slate-400">
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
              
              <!-- Advanced Options Accordion -->
              <div class="bg-slate-700/30 rounded-lg border border-slate-600/50">
                <button 
                  type="button"
                  onclick={toggleAdvancedOptions}
                  class="w-full px-4 py-3 flex justify-between items-center text-left text-sm font-medium text-slate-200 hover:bg-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                >
                  <span class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                    </svg>
                    Advanced Options
                  </span>
                  <svg class={`h-5 w-5 transform transition-transform duration-200 ${showAdvancedOptions ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
                
                {#if showAdvancedOptions}
                  <div class="p-4 border-t border-slate-600/50 space-y-4">
                    <!-- AI Provider -->
                    <div>
                      <label for="aiProvider" class="block text-sm font-medium text-slate-300 mb-2">
                        AI Provider
                      </label>
                      <select
                        id="aiProvider"
                        name="aiProvider"
                        value={aiProvider}
                        oninput={handleProviderChange}
                        class="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
                        disabled={isAnalyzing}
                      >
                        {#each aiProviders as option}
                          <option value={option.value}>{option.label}</option>
                        {/each}
                      </select>
                    </div>
                    
                    <!-- AI Model -->
                    <div>
                      <label for="aiModel" class="block text-sm font-medium text-slate-300 mb-2">
                        AI Model
                      </label>
                      <select
                        id="aiModel"
                        name="aiModel"
                        value={aiModel}
                        class="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
                        disabled={isAnalyzing}
                      >
                        {#each availableModels as model}
                          <option value={model.id}>{model.name}</option>
                        {/each}
                      </select>
                      <p class="mt-1 text-xs text-slate-400">
                        {#if aiModel}
                          {availableModels.find((m: AIModel) => m.id === aiModel)?.description || ''}
                        {/if}
                      </p>
                    </div>
                  </div>
                {/if}
              </div>
              
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
                    Analyzing...
                  {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-3 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M7 9a2 2 0 114 0 2 2 0 01-4 0zm9-2a2 2 0 100-4 2 2 0 000 4zM4 7a2 2 0 100-4 2 2 0 000 4zm0 10a2 2 0 100-4 2 2 0 000 4zm9-2a2 2 0 114 0 2 2 0 01-4 0zm0-10a2 2 0 114 0 2 2 0 01-4 0zM7 15a2 2 0 114 0 2 2 0 01-4 0z" clip-rule="evenodd" />
                    </svg>
                    Analyze Contract
                  {/if}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Error Display -->
      {#if error}
        <div class="mt-8 p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-red-500/50">
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-red-400">Error</h2>
              <p class="mt-1 text-slate-300">{error}</p>
            </div>
          </div>
        </div>
      {/if}
      
      <!-- Results -->
      {#if success && explanation}
        <div class="mt-8">
          <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-slate-700 p-6">
            <div class="flex justify-between items-center mb-4 pb-4 border-b border-slate-700">
              <h2 class="text-xl font-semibold text-white">Smart Contract Analysis</h2>
              <span class="text-sm px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                {promptTypes.find((p: PromptInfo) => p.value === promptType)?.label || 'Standard Analysis'}
              </span>
            </div>
            <div class="prose prose-invert max-w-none">
              <p class="whitespace-pre-line text-slate-300">{explanation}</p>
            </div>
          </div>
          
          <!-- Raw TEAL code (collapsible) -->
          {#if decodedProgram}
            <details class="mt-4 bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-slate-700 group">
              <summary class="p-4 text-slate-200 cursor-pointer flex items-center justify-between hover:bg-slate-700/50 transition-colors">
                <span class="font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                  View Raw TEAL Code
                </span>
                <svg class="h-5 w-5 text-slate-400 group-open:rotate-180 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </summary>
              <div class="p-4 border-t border-slate-700">
                <pre class="p-4 bg-slate-900 rounded-lg overflow-auto text-sm font-mono text-slate-300 max-h-96 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">{decodedProgram}</pre>
              </div>
            </details>
          {/if}
        </div>
      {/if}
    </div>
  </main>
  
  <!-- Footer -->
  <footer class="py-6 border-t border-slate-800">
    <div class="container mx-auto px-4">
      <div class="text-center text-slate-500 text-sm">
        <p>Powered by Algorand and AI • Analyze smart contracts with confidence</p>
      </div>
    </div>
  </footer>
</div>

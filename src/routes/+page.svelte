<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PromptType, AIModel, PromptInfo } from '$shared/types';
  import type { AnalysisForm } from '$lib/types';
  import { AIProvider } from '$shared/types';
  
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
  
  // Process step messages with different themes
  type MessageSet = {
    theme: string;
    messages: string[];
  };
  
  const processSets: MessageSet[] = [
    {
      theme: "Metaphorical Journey",
      messages: [
        "Spelunking into the blockchain caves...",
        "Untangling the base64 spaghetti...",
        "Translating ancient TEAL hieroglyphics...",
        "Teaching AI to speak human about what it found..."
      ]
    },
    {
      theme: "Detective Theme",
      messages: [
        "Detective work: Tracking down your contract on the blockchain...",
        "Decoding the secret base64 message...",
        "Interrogating the TEAL code for answers...",
        "Consulting with AI to solve the final puzzle..."
      ]
    },
    {
      theme: "Kitchen/Cooking Theme",
      messages: [
        "Hunting for fresh ingredients on the blockchain...",
        "Unwrapping the base64 packaging...",
        "Prepping the raw TEAL for cooking...",
        "Chef AI preparing your simplified explanation..."
      ]
    },
    {
      theme: "Space/Alien Theme",
      messages: [
        "Launching search probes into the blockchain universe...",
        "Decrypting alien base64 transmissions...",
        "Translating TEAL to Earth languages...",
        "AI ambassador preparing human-friendly message..."
      ]
    },
    {
      theme: "Translation Theme",
      messages: [
        "Finding the contract in blockchain-ese...",
        "Converting from base64 to something less robotic...",
        "Decompiling TEAL into almost-human language...",
        "AI finishing the translation to plain English..."
      ]
    },
    {
      theme: "Magic Theme",
      messages: [
        "Summoning your contract from the blockchain realm...",
        "Casting 'Decode Base64' spell...",
        "Transforming cryptic TEAL into readable form...",
        "AI wizard conjuring the final human-friendly explanation..."
      ]
    }
  ];
  
  let currentMessageSet = $state<MessageSet | null>(null);
  let currentStepIndex = $state(0);
  let currentMessage = $derived(
    currentMessageSet?.messages[currentStepIndex] || "Analyzing..."
  );
  let progressInterval: number | undefined = undefined;
  
  // Function to select a random message set and start the step progression
  function startProcessAnimation() {
    // Select a random message set
    const randomIndex = Math.floor(Math.random() * processSets.length);
    currentMessageSet = processSets[randomIndex];
    currentStepIndex = 0;
    
    // Clear any existing interval
    if (progressInterval) clearInterval(progressInterval);
    
    // Define the step durations (first 3 steps longer, last step shorter)
    const stepDurations = [4000, 3500, 3000, 2500]; // ms for each step
    
    // Start the progression through steps
    let nextStepTime = stepDurations[0];
    progressInterval = setInterval(() => {
      if (currentStepIndex < currentMessageSet!.messages.length - 1) {
        currentStepIndex++;
        
        // If we've reached the last step or beyond, clear the interval
        if (currentStepIndex >= currentMessageSet!.messages.length - 1) {
          if (progressInterval) clearInterval(progressInterval);
        } else {
          // Otherwise, adjust the interval for the next step
          if (progressInterval) clearInterval(progressInterval);
          nextStepTime = stepDurations[currentStepIndex];
          progressInterval = setInterval(() => {
            if (currentStepIndex < currentMessageSet!.messages.length - 1) {
              currentStepIndex++;
              
              // If we've reached the last step, clear the interval
              if (currentStepIndex >= currentMessageSet!.messages.length - 1) {
                if (progressInterval) clearInterval(progressInterval);
              }
            }
          }, nextStepTime);
        }
      }
    }, nextStepTime);
  }
  
  // Function to stop the animation
  function stopProcessAnimation() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = undefined;
    }
    currentMessageSet = null;
    currentStepIndex = 0;
  }
  
  // Extract form and result data using derived values
  let formData = $derived<AnalysisForm>(form || {});
  let applicationId = $derived(formData.applicationId || '1134695678');
  let promptType = $derived<PromptType>(formData.promptType || 'standard');
  
  // Fixed to Claude and haiku for now
  let aiProvider = $state<AIProvider>(data.defaultConfig.provider);
  let aiModel = $state(data.defaultConfig.model);
  
  let error = $derived(formData.error);
  let success = $derived(formData.success);
  let explanation = $derived(formData.explanation);
  let decodedProgram = $derived(formData.decodedProgram);
  
  // Get all models from server data
  const allModels = $state(data.aiModels);
  // Filter models by provider - only Claude models for now
  let availableModels = $derived(allModels.filter((model: AIModel) => model.provider === aiProvider));
  
  // When provider changes, select the first available model of that provider
  $effect(() => {
    if (availableModels.length > 0 && !availableModels.some((m: AIModel) => m.id === aiModel)) {
      aiModel = availableModels[0].id;
    }
  });
  
  // Get prompt types from server data
  const promptTypes = data.promptTypes;
  
  // Available AI providers
  const aiProviders = [
    { value: AIProvider.Claude, label: 'Anthropic Claude' },
    { value: AIProvider.OpenAI, label: 'OpenAI GPT' },
    { value: AIProvider.Gemini, label: 'Google Gemini' }
  ];
  
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
        <!-- Minimalist Logo - No Background -->
        <div class="h-12 w-12 flex items-center justify-center">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-lg">
            <!-- Abstract representation of code transformation - larger elements -->
            <path d="M14 16L8 24L14 32" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M34 16L40 24L34 32" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            
            <!-- Central element representing transformation -->
            <path d="M18 10L30 38" stroke="#80FFD4" stroke-width="3" stroke-linecap="round" />
            
            <!-- Simple block representing a smart contract - larger -->
            <rect x="20" y="20" width="8" height="8" rx="1.5" fill="white" fill-opacity="0.95" />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Decipher</h1>
          <p class="text-sm opacity-90">Smart contracts, dumb simple.</p>
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
              startProcessAnimation();
              
              return async ({ update }) => {
                await update();
                isAnalyzing = false;
                stopProcessAnimation();
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
                  Enter the ID of the Algorand application you want to decipher
                </p>
              </div>
              
              <!-- Analysis Type -->
              <div>
                <label for="promptType" class="block text-sm font-medium text-slate-300 mb-2">
                  Decipher Type
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
                    For people: Simple explanation of what this contract does and how it works
                  {:else if promptType === 'detailed'} 
                    For developers: In-depth technical analysis of the contract's implementation
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
                      <div class="relative">
                        <select
                          id="aiProvider"
                          name="aiProvider"
                          value={aiProvider}
                          onchange={(e) => aiProvider = e.currentTarget.value as AIProvider}
                          class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white appearance-none"
                          disabled={isAnalyzing}
                        >
                          {#each aiProviders as option}
                            <option value={option.value}>{option.label}</option>
                          {/each}
                        </select>
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <!-- AI Model -->
                    <div>
                      <label for="aiModel" class="block text-sm font-medium text-slate-300 mb-2">
                        AI Model
                      </label>
                      <div class="relative">
                        <select
                          id="aiModel"
                          name="aiModel"
                          value={aiModel}
                          onchange={(e) => aiModel = e.currentTarget.value}
                          class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white appearance-none"
                          disabled={isAnalyzing}
                        >
                          {#each availableModels as model}
                            <option value={model.id}>{model.name}</option>
                          {/each}
                        </select>
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <p class="mt-1 text-xs text-slate-400">
                        {availableModels.find((m: AIModel) => m.id === aiModel)?.description || "Select an AI model"}
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
                    <span class="transition-all duration-500 ease-in-out">{currentMessage}</span>
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
              <h2 class="text-xl font-semibold text-white">Smart Contract Translation</h2>
              <div class="flex items-center space-x-3">
                <button 
                  onclick={() => {
                    // Create a JSON object with the response data
                    const jsonData = {
                      applicationId,
                      explanation
                    };
                    
                    // Convert to a JSON string with formatting
                    const jsonString = JSON.stringify(jsonData, null, 2);
                    
                    // Create a Blob object
                    const blob = new Blob([jsonString], { type: 'application/json' });
                    
                    // Create a URL for the Blob
                    const url = URL.createObjectURL(blob);
                    
                    // Create a link element
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `contract-${applicationId}.json`;
                    
                    // Append to the body, click, and remove
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    
                    // Revoke the URL to free up memory
                    URL.revokeObjectURL(url);
                  }}
                  class="flex items-center px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 text-sm transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download JSON
                </button>
                <span class="text-sm px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                  {promptTypes.find((p: PromptInfo) => p.value === promptType)?.label || 'Standard Translation'}
                </span>
              </div>
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
                  View Robot Language (TEAL Code)
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
        <p>Powered by Algorand and AI • Making crypto contracts human-friendly</p>
      </div>
    </div>
  </footer>
</div>

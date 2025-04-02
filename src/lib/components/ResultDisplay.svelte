<script lang="ts">
  import TitleWithLink from './TitleWithLink.svelte';
  
  let { 
    success,
    explanation, 
    basicOverview,
    detailedAnalysis,
    decodedProgram, 
    applicationId
  } = $props<{
    success: boolean | null;
    explanation: string | null;
    basicOverview: string | null;
    detailedAnalysis: string | null;
    decodedProgram: string | null;
    applicationId: string;
  }>();
  
  // State for view toggle - default to basic view
  let showDetailedView = $state(false);
  
  // Toggle between basic and detailed view
  function toggleView() {
    showDetailedView = !showDetailedView;
  }
  
  // Reset to basic view whenever the application ID changes
  $effect(() => {
    if (applicationId) {
      showDetailedView = false;
    }
  });
  
  // Format text with markdown-like features
  function formatContent(content: string): string {
    if (!content) return '';
    
    // Convert basic markdown to HTML
    return content
      // Make bullet points look nice
      .replace(/^-\s+(.+)$/gm, '<li>$1</li>')
      // Bold text
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Handle bullet point sections
      .replace(/<li>([^<]+)<\/li>/g, '<li>$1</li>');
  }
  
  function downloadJson() {
    // Create a JSON object with the response data
    const jsonData = {
      applicationId,
      basicOverview,
      detailedAnalysis
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
  }
</script>

{#if success && (basicOverview || detailedAnalysis)}
  <div class="mt-8">
    <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-slate-700 p-6">
      <div>
        <TitleWithLink title="Smart Contract Translation" {applicationId} />
      </div>
      
      <div class="flex justify-end items-center mb-4 mt-2">
        <div class="flex items-center space-x-3">
          <button 
            onclick={downloadJson}
            class="flex items-center px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 text-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download JSON
          </button>
          
          <!-- Toggle Switch -->
          <div class="flex items-center space-x-2">
            <span class="text-sm text-slate-300">Basic</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={showDetailedView} class="sr-only peer" onclick={toggleView}>
              <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-400/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
            <span class="text-sm text-slate-300">Detailed</span>
          </div>
        </div>
      </div>
      
      <div class="prose prose-invert max-w-none">
        <!-- Basic Overview (shown by default) -->
        {#if !showDetailedView && basicOverview}
          <div class="space-y-4 animate-fadeIn">
            <div class="text-slate-300">
              <h3 class="text-lg font-medium text-cyan-400 mb-4">Basic Overview</h3>
              
              <div class="whitespace-pre-line">
                {#if basicOverview.includes("One-sentence explanation:") || basicOverview.includes("In other words...")}
                  <!-- Format with sections -->
                  {#each basicOverview.split('\n') as line}
                    {#if line.trim().startsWith("One-sentence explanation:") || line.trim().startsWith("In other words...")}
                      <p class="mb-2 font-medium text-cyan-300">{line}</p>
                    {:else if line.trim().startsWith("-")}
                      <p class="mb-1 ml-4">{line}</p>
                    {:else if line.trim() !== ''}
                      <p class="mb-2">{line}</p>
                    {/if}
                  {/each}
                {:else}
                  <!-- Simple format - try to detect sentences -->
                  {#each basicOverview.split('\n') as line}
                    {#if line.trim().startsWith("-")}
                      <p class="mb-1 ml-4">{line}</p>
                    {:else if line.trim() !== ''}
                      <p class="mb-2">{line}</p>
                    {/if}
                  {/each}
                {/if}
              </div>
            </div>
          </div>
        {:else if showDetailedView && detailedAnalysis}
          <!-- Detailed Analysis (shown when toggled) -->
          <div class="space-y-4 animate-fadeIn">
            <div class="text-slate-300">
              <h3 class="text-lg font-medium text-emerald-400 mb-4">Detailed Analysis</h3>
              
              <div class="whitespace-pre-line">
                {#if detailedAnalysis.includes("Main purpose of the contract:") || detailedAnalysis.includes("Key capabilities:")}
                  <!-- Format with recognized sections -->
                  {#each detailedAnalysis.split('\n') as line}
                    {#if line.trim().toLowerCase().startsWith("main purpose") || 
                        line.trim().toLowerCase().startsWith("key capabilities") || 
                        line.trim().toLowerCase().startsWith("list of method")}
                      <p class="mb-2 mt-4 font-medium text-emerald-300">{line}</p>
                    {:else if line.trim().startsWith("-")}
                      <div class="ml-4 mb-1">{line}</div>
                    {:else if line.trim() !== ''}
                      <p class="mb-2">{line}</p>
                    {/if}
                  {/each}
                {:else}
                  <!-- Simple format - detect bullets at least -->
                  {#each detailedAnalysis.split('\n') as line}
                    {#if line.trim().startsWith("-")}
                      <div class="ml-4 mb-1">{line}</div>
                    {:else if line.trim() !== ''}
                      <p class="mb-2">{line}</p>
                    {/if}
                  {/each}
                {/if}
              </div>
            </div>
          </div>
        {:else}
          <!-- Fallback to full explanation if sections couldn't be parsed -->
          <p class="whitespace-pre-line text-slate-300">{explanation}</p>
        {/if}
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

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
</style> 
<script lang="ts">
  import type { CachedAnalysisResult } from '$lib/types';
  import { PUBLIC_EXPLORER_URL } from '$env/static/public';
  import { onMount } from 'svelte';
  
  // Props for the component
  let { analyses } = $props<{
    analyses: CachedAnalysisResult[];
  }>();
  
  // Active index for the animation
  let activeIndex = $state(0);
  let showDetailedView = $state(false);
  
  // Swipe gesture variables
  let startX = 0;
  let container: HTMLElement;
  
  // Format timestamp
  function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }
  
  // Change to a specific analysis
  function showAnalysis(index: number) {
    activeIndex = index;
    showDetailedView = false;
  }
  
  // Navigate to next/previous analysis
  function next() {
    activeIndex = (activeIndex + 1) % analyses.length;
    showDetailedView = false;
  }
  
  function prev() {
    activeIndex = (activeIndex - 1 + analyses.length) % analyses.length;
    showDetailedView = false;
  }
  
  // Toggle between basic and detailed view
  function toggleView(value: boolean) {
    showDetailedView = value;
  }
  
  // Handle swipe gestures
  function handleTouchStart(event: TouchEvent) {
    startX = event.touches[0].clientX;
  }
  
  function handleTouchEnd(event: TouchEvent) {
    const endX = event.changedTouches[0].clientX;
    const diffX = endX - startX;
    
    // If the swipe is significant enough (more than 50px)
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swipe right - go to previous
        prev();
      } else {
        // Swipe left - go to next
        next();
      }
    }
  }
  
  // Generate explorer URL
  function getExplorerUrl(applicationId: string): string {
    return `${PUBLIC_EXPLORER_URL}/application/${applicationId}`;
  }
  
  onMount(() => {
    // Add keyboard navigation support
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        next();
      } else if (e.key === 'ArrowLeft') {
        prev();
      }
    };
    
    window.addEventListener('keydown', handleKeydown);
    
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

{#if analyses.length > 0}
  <div class="bg-slate-800 rounded-lg p-6 mt-8 shadow-lg">
    <h2 class="text-xl font-semibold text-slate-200 mb-4 pb-3 border-b border-slate-700">Recent Analyses</h2>
    
    <div 
      class="relative overflow-hidden h-[400px] touch-none border border-slate-700/50 rounded-lg bg-slate-800/30 backdrop-blur-sm mb-4"
      bind:this={container}
      ontouchstart={handleTouchStart}
      ontouchend={handleTouchEnd}
    >
      {#each analyses as analysis, i}
        <div 
          class="absolute inset-0 w-full transform transition-transform duration-500 ease-in-out opacity-0 p-4 overflow-y-auto h-full"
          style="transform: translateX({(i - activeIndex) * 100}%); opacity: {i === activeIndex ? 1 : 0}"
        >
          <div class="flex flex-col h-full">
            <div class="mb-3">
              <div class="flex justify-between items-center mb-2">
                <h3 class="text-lg font-medium text-cyan-400">Application {analysis.applicationId}</h3>
                <span class="text-xs text-slate-400">{formatDate(analysis.timestamp)}</span>
              </div>
              
              <div class="flex items-center justify-between mb-3 text-sm">
                <div class="flex space-x-4">
                  <button 
                    class={`text-${!showDetailedView ? 'cyan-400 border-b border-cyan-400' : 'slate-300 hover:text-slate-100'} transition-colors`}
                    onclick={() => toggleView(false)}
                  >
                    Basic
                  </button>
                  <button 
                    class={`text-${showDetailedView ? 'emerald-400 border-b border-emerald-400' : 'slate-300 hover:text-slate-100'} transition-colors`}
                    onclick={() => toggleView(true)}
                  >
                    Detailed
                  </button>
                </div>
                
                <a 
                  href={getExplorerUrl(analysis.applicationId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center text-xs text-slate-300 hover:text-slate-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View on Allo
                </a>
              </div>
            </div>
            
            <div class="flex-grow overflow-y-auto pr-2 custom-scrollbar">
              {#if !showDetailedView}
                <div class="text-sm text-slate-300 space-y-4 animate-fadeIn">
                  <h4 class="text-lg font-medium text-cyan-400 mb-4">Basic Overview</h4>
                  <div class="whitespace-pre-line">
                    {#if analysis.basicOverview.includes("One-sentence explanation:") || analysis.basicOverview.includes("In other words...")}
                      <!-- Format with sections -->
                      {#each analysis.basicOverview.split('\n') as line}
                        {#if line.trim().toLowerCase().startsWith("one-sentence") || line.trim().toLowerCase().startsWith("in other words")}
                          <p class="mb-2 font-medium text-cyan-300">{line}</p>
                        {:else if line.trim().startsWith("-")}
                          <p class="mb-1 ml-4">{line}</p>
                        {:else if line.trim() !== ''}
                          <p class="mb-2">{line}</p>
                        {/if}
                      {/each}
                    {:else}
                      <!-- Simple format -->
                      {#each analysis.basicOverview.split('\n') as line}
                        {#if line.trim().startsWith("-")}
                          <p class="mb-1 ml-4">{line}</p>
                        {:else if line.trim() !== ''}
                          <p class="mb-2">{line}</p>
                        {/if}
                      {/each}
                    {/if}
                  </div>
                </div>
              {:else}
                <div class="text-sm text-slate-300 space-y-4 animate-fadeIn">
                  <h4 class="text-lg font-medium text-emerald-400 mb-4">Detailed Analysis</h4>
                  <div class="whitespace-pre-line">
                    {#if analysis.detailedAnalysis.includes("Main purpose of the contract:") || analysis.detailedAnalysis.includes("Key capabilities:")}
                      <!-- Format with recognized sections -->
                      {#each analysis.detailedAnalysis.split('\n') as line}
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
                      <!-- Simple format -->
                      {#each analysis.detailedAnalysis.split('\n') as line}
                        {#if line.trim().startsWith("-")}
                          <div class="ml-4 mb-1">{line}</div>
                        {:else if line.trim() !== ''}
                          <p class="mb-2">{line}</p>
                        {/if}
                      {/each}
                    {/if}
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Navigation controls -->
    <div class="flex justify-center items-center mt-4">
      <button 
        class="p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition mr-4"
        onclick={prev}
        aria-label="Previous analysis"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <div class="flex space-x-2">
        {#each analyses as _, i}
          <button 
            class={`w-3 h-3 rounded-full transition-colors ${i === activeIndex ? 'bg-cyan-400' : 'bg-slate-600 hover:bg-slate-500'}`}
            onclick={() => showAnalysis(i)}
            aria-label={`Show analysis ${i+1}`}
          ></button>
        {/each}
      </div>
      
      <button 
        class="p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition ml-4"
        onclick={next}
        aria-label="Next analysis"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
{/if}

<style>
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(100, 116, 139, 0.5) rgba(30, 41, 59, 0.8);
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(30, 41, 59, 0.8);
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(100, 116, 139, 0.5);
    border-radius: 4px;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
</style> 
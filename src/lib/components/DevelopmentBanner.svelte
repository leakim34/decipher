<script lang="ts">
  import { onMount } from 'svelte';
  
  // Start minimized by default and check device width in onMount
  let isVisible = $state(true);
  let isMinimized = $state(true); // Default to minimized
  
  // Animation state - reduce floating amount
  let floatPosition = $state(0);
  let floatInterval: number;
  
  onMount(() => {
    // Check if we should expand based on screen size
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      isMinimized = false;
    }
    
    // Less pronounced floating animation
    floatInterval = setInterval(() => {
      floatPosition = Math.sin(Date.now() / 1000) * 3;
    }, 100);
    
    return () => {
      clearInterval(floatInterval);
    };
  });
  
  // Minimize the banner
  function minimize() {
    isMinimized = true;
  }
  
  // Restore the banner
  function restore() {
    isMinimized = false;
  }
  
  // Close the banner permanently
  function close() {
    isVisible = false;
  }
</script>

{#if isVisible}
  <!-- Minimized state - smaller icon -->
  {#if isMinimized}
    <div 
      class="fixed bottom-4 right-4 bg-slate-800/60 backdrop-blur-sm p-1.5 rounded-full shadow-md border border-slate-700/50 cursor-pointer transition-all duration-300 hover:bg-slate-700/70 z-40"
      style="transform: translateY({floatPosition}px)"
      onclick={restore}
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-400/80" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clip-rule="evenodd" />
      </svg>
    </div>
  <!-- Full banner - more compact and subtle -->
  {:else}
    <div 
      class="fixed max-w-[92%] sm:max-w-xs right-4 bottom-4 p-3 bg-slate-800/70 backdrop-blur-sm rounded-lg shadow-md border border-slate-700/50 text-slate-300 z-40 transition-all text-xs sm:text-sm"
      style="transform: translateY({floatPosition}px)"
    >
      <div class="flex items-start justify-between mb-1">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-emerald-400/90" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clip-rule="evenodd" />
          </svg>
          <h3 class="font-medium text-xs">Experimental Project</h3>
        </div>
        <div class="flex space-x-1 ml-2">
          <button 
            onclick={minimize}
            class="text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Minimize"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
          <button 
            onclick={close}
            class="text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <p class="text-xs mb-1 text-slate-300/90 leading-snug">
        This prototype serves as a foundation for better blockchain tools.
      </p>
      
      <div class="text-xs text-slate-400/90">
        <a href="https://github.com/leakim34/decipher" target="_blank" rel="noopener noreferrer" class="text-emerald-400/90 hover:text-emerald-400 transition-colors text-[10px] hover:underline">
          View on GitHub &rarr;
        </a>
      </div>
    </div>
  {/if}
{/if} 
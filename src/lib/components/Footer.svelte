<script lang="ts">
  import { onMount } from 'svelte';
  
  // List of fun footer messages
  const messages = [
    "Deciphering crypto, one contract at a time",
    "Making smart contracts less cryptic since 2025",
    "Because smart contracts should make sense to humans too",
    "When machines speak human",
    "Demystifying the blockchain, one app at a time"
  ];
  
  let randomMessage = $state('');
  
  onMount(() => {
    // Pick a random message
    randomMessage = messages[Math.floor(Math.random() * messages.length)];
  });
</script>

<footer class="py-6 border-t border-slate-800 mt-10">
  <div class="container mx-auto px-4">
    <div class="max-w-3xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="text-slate-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span class="font-medium">Decipher</span>
        </div>
        <div class="text-center text-slate-400 text-sm italic">
          {randomMessage}
        </div>
        <div class="flex items-center space-x-4">
          <a 
            href="https://github.com/leakim34/decipher" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="text-slate-400 hover:text-white transition-colors"
            aria-label="GitHub Repository"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>
      
      <div class="mt-4 border-t border-slate-800 pt-4 text-xs text-center text-slate-500">
        <p>
          Created by 
          <a href="https://github.com/leakim34" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300 transition-colors">
            leakz
          </a> 
          at 
          <span class="font-semibold text-slate-400">Dev Retreat 2025</span> •
          An 
          <a href="https://algorand.foundation" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300 transition-colors">
            Algorand Foundation
          </a> 
          hackathon
        </p>
        <p class="mt-1">
          Powered by Algorand, Svelte, and Claude AI • Open Source and Free to Use
        </p>
      </div>
    </div>
  </div>
</footer> 
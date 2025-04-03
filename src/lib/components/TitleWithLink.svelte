<script lang="ts">
  import { PUBLIC_EXPLORER_URL } from '$env/static/public';
  
  // Props for the component
  let { title, applicationId, className = '' } = $props<{
    title: string;
    applicationId: string;
    className?: string;
  }>();
  
  // Generate the explorer URL
  let explorerUrl = $derived(`${PUBLIC_EXPLORER_URL}/application/${applicationId}`);
</script>

<div class={`flex justify-between items-center mb-4 pb-3 border-b border-slate-700 ${className}`}>
  <h2 class="text-xl font-semibold text-slate-200">Application {applicationId}</h2>
  {#if applicationId}
    <a 
      href={explorerUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="flex items-center text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
      View on Allo
    </a>
  {/if}
</div> 
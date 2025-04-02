<script lang="ts">
  let { error } = $props<{
    error: string | null;
  }>();
</script>

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
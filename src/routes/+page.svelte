<script lang="ts">
  import type { AnalysisForm, CachedAnalysisResult } from '$lib/types';
  import { appState } from '$lib/stores/app-state.svelte';
  
  // Import our components
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import SearchApp from '$lib/components/SearchApp.svelte';
  import SearchWallet from '$lib/components/SearchWallet.svelte';
  import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
  import ResultDisplay from '$lib/components/ResultDisplay.svelte';
  import MessageAnimation from '$lib/components/MessageAnimation.svelte';
  import RecentAnalyses from '$lib/components/RecentAnalyses.svelte';
  import DevelopmentBanner from '$lib/components/DevelopmentBanner.svelte';
  
  // Use props to get data from the server
  let { form, data } = $props<{ 
    form: AnalysisForm | null;
    data: {
      recentAnalyses: CachedAnalysisResult[];
    };
  }>();
  
  // Extract form and result data using derived values
  let formData = $derived<AnalysisForm>(form || {});
  let applicationId = $derived(formData.applicationId || '');
  
  let error = $derived(formData.error || null);
  let success = $derived(formData.success || null);
  let explanation = $derived(formData.explanation || null);
  let basicOverview = $derived(formData.basicOverview || null);
  let detailedAnalysis = $derived(formData.detailedAnalysis || null);
  let decodedProgram = $derived(formData.decodedProgram || null);
  
  // Extract recent analyses from data
  let recentAnalyses = $derived(data.recentAnalyses || []);
  
  // Get active tab from store
  let activeTab = $derived(appState.activeTab);
  $effect(() => {
    if (activeTab === 'wallet') {
        success = null;
        error = null;
    }
  });
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100">
  <!-- Header -->
  <Header />
  
  <!-- Development Banner -->
  <DevelopmentBanner />
  
  <main class="container mx-auto px-4 py-10">
    <div class="max-w-3xl mx-auto">
      <!-- Tab Selection -->
      <div class="mb-6 flex items-center justify-center p-1 bg-slate-800/70 rounded-lg border border-slate-700">
        <button 
          type="button" 
          class={`flex-1 py-2 px-4 rounded-md transition-all ${activeTab === 'application' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-700/50'}`}
          onclick={() => { appState.activeTab = 'application'; }}
        >
          Decipher App
        </button>
        <button 
          type="button" 
          class={`flex-1 py-2 px-4 rounded-md transition-all ${activeTab === 'wallet' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-700/50'}`}
          onclick={() => { appState.activeTab = 'wallet'; }}
        >
          Search in Wallet
        </button>
      </div>
      
      <!-- Search Forms -->
      {#if activeTab === 'application'}
        <SearchApp >
          <MessageAnimation />
        </SearchApp>
        
        <!-- Error Display -->
        <ErrorDisplay error={error} />
        
        <!-- Results -->
        {#if success}
          <ResultDisplay 
            success={success}
            explanation={explanation}
            basicOverview={basicOverview}
            detailedAnalysis={detailedAnalysis}
            decodedProgram={decodedProgram}
            applicationId={applicationId}
          />
        {/if}
      {:else}
        <SearchWallet />
      {/if}
      
      <!-- Recent Analyses - only show on application tab or when no search has been performed -->
      {#if activeTab === 'application'}
        <RecentAnalyses 
          analyses={recentAnalyses}
        />
      {/if}
    </div>
  </main>
  
  <!-- Footer -->
  <Footer />
</div>

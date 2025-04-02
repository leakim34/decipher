<script lang="ts">
  import type { AnalysisForm } from '$lib/types';
  
  // Import our components
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import SearchForm from '$lib/components/SearchForm.svelte';
  import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
  import ResultDisplay from '$lib/components/ResultDisplay.svelte';
  import MessageAnimation from '$lib/components/MessageAnimation.svelte';
  
  // Use props to get data from the server
  let { form } = $props<{ 
    form: AnalysisForm | null
  }>();
  
  // Extract form and result data using derived values
  let formData = $derived<AnalysisForm>(form || {});
  let applicationId = $derived(formData.applicationId || '1134695678');
  
  let error = $derived(formData.error || null);
  let success = $derived(formData.success || null);
  let explanation = $derived(formData.explanation || null);
  let basicOverview = $derived(formData.basicOverview || null);
  let detailedAnalysis = $derived(formData.detailedAnalysis || null);
  let decodedProgram = $derived(formData.decodedProgram || null);
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100">
  <!-- Header -->
  <Header />
  
  <main class="container mx-auto px-4 py-10">
    <div class="max-w-3xl mx-auto">
      <!-- Search Form -->
      <SearchForm 
        applicationId={applicationId}
      >
        <MessageAnimation />
      </SearchForm>
      
      <!-- Error Display -->
      <ErrorDisplay error={error} />
      
      <!-- Results -->
      <ResultDisplay 
        success={success}
        explanation={explanation}
        basicOverview={basicOverview}
        detailedAnalysis={detailedAnalysis}
        decodedProgram={decodedProgram}
        applicationId={applicationId}
      />
    </div>
  </main>
  
  <!-- Footer -->
  <Footer />
</div>

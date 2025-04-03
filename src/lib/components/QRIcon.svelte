<script lang="ts">
  let { size = 24 }: { size?: number } = $props();
</script>

<svg 
  xmlns="http://www.w3.org/2000/svg" 
  width={size} 
  height={size} 
  viewBox="0 0 24 24" 
  fill="none" 
  stroke="currentColor" 
  stroke-width="1.75" 
  stroke-linecap="round" 
  stroke-linejoin="round"
  class="qr-icon"
>
  <!-- QR Code -->
  <rect x="7" y="7" width="10" height="10" rx="1" style="stroke-opacity: 0.7" />
  
  <!-- QR Code Elements (simplified) -->
  <rect x="9" y="9" width="2" height="2" style="stroke-opacity: 0.7" fill="currentColor" fill-opacity="0.2" />
  <rect x="13" y="9" width="2" height="2" style="stroke-opacity: 0.7" fill="currentColor" fill-opacity="0.2" />
  <rect x="9" y="13" width="2" height="2" style="stroke-opacity: 0.7" fill="currentColor" fill-opacity="0.2" />
  
  <!-- Scan Frame Corner Brackets -->
  <path d="M4 7v3M7 4h3" stroke-width="2" />
  <path d="M20 7v3M17 4h3" stroke-width="2" />
  <path d="M4 17v-3M7 20h3" stroke-width="2" />
  <path d="M20 17v-3M17 20h3" stroke-width="2" />
  
  <!-- Scan Line -->
  <line x1="5" y1="12" x2="19" y2="12" class="scan-line" />
</svg>

<style>
  .qr-icon {
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  }
  
  .scan-line {
    stroke: currentColor;
    stroke-opacity: 1;
    stroke-width: 1.25;
    animation: scan 2s infinite ease-in-out;
  }
  
  @keyframes scan {
    0% {
      transform: translateY(-4px);
      opacity: 0.6;
    }
    50% {
      transform: translateY(4px);
      opacity: 1;
    }
    100% {
      transform: translateY(-4px);
      opacity: 0.6;
    }
  }
</style> 
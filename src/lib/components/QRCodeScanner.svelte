<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Html5Qrcode } from 'html5-qrcode';

  let { onScan, onClose } = $props<{
    onScan: (result: string) => void;
    onClose: () => void;
  }>();

  let scanner = $state<Html5Qrcode | null>(null);
  let scannerElement = $state<HTMLDivElement | null>(null);
  let error = $state<string>('');
  
  const qrboxFunction = (viewfinderWidth: number, viewfinderHeight: number) => {
    const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
    const boxSize = Math.floor(minEdge * 0.7);
    return {
      width: boxSize,
      height: boxSize
    };
  };

  async function startScanner() {
    if (!scannerElement) return;
    
    try {
      await scanner?.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: qrboxFunction,
          aspectRatio: 1.0
        },
        (result) => {
          onScan(result);
          stopScanner();
          onClose();
        },
        (errorMessage) => {
          // console.error('QR scan error:', errorMessage);
        }
      );
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to start camera';
      console.error('QR scanner error:', err);
    }
  }

  async function stopScanner() {
    try {
      if (scanner) {
        await scanner.stop();
      }
    } catch (err) {
      // silent error
    }
  }

  onMount(() => {
    if (scannerElement) {
      scanner = new Html5Qrcode('qr-reader');
      startScanner();
    }
  });

  onDestroy(() => {
    stopScanner();
  });
</script>

<div class="qr-popup-overlay" onclick={onClose}>
  <div class="qr-popup" onclick={(e) => e.stopPropagation()}>
    <div class="qr-popup-header">
      <h2>Scan QR Code</h2>
      <button class="close-button" onclick={onClose}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    {#if error}
      <div class="error-message">{error}</div>
    {/if}
    
    <div id="qr-reader" bind:this={scannerElement}></div>
    
    <p class="scanner-note">
      Position the QR code in the frame to scan
    </p>
  </div>
</div>

<style>
  .qr-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }
  
  .qr-popup {
    background-color: white;
    border-radius: 0.5rem;
    width: 90%;
    max-width: 400px;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
  }
  
  .qr-popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .qr-popup-header h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: #1f2937;
  }
  
  .close-button {
    background: none;
    border: none;
    cursor: pointer;
    color: #6b7280;
    display: flex;
    padding: 0.25rem;
  }
  
  .close-button:hover {
    color: #111827;
  }
  
  #qr-reader {
    width: 100%;
    height: 300px;
  }
  
  #qr-reader video {
    border-radius: 0;
  }
  
  .error-message {
    color: #ef4444;
    padding: 0.75rem;
    font-size: 0.875rem;
    background-color: #fee2e2;
    margin: 0;
  }
  
  .scanner-note {
    text-align: center;
    padding: 0.75rem;
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
    border-top: 1px solid #e5e7eb;
  }
</style> 
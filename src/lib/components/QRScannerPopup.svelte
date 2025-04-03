<script lang="ts">
  import QRCodeScanner from './QRCodeScanner.svelte';
  import { appState } from '$lib/stores/app-state.svelte';
  import { parseQRCode, QRCodeType } from '$lib/shared/qrcode';

  // Local state for scanner visibility
  let isOpen = $state(false);
  
  // Handle successful scan
  function handleScan(result: string) {
    try {
      // Parse the QR code result to extract relevant information
      const parsedResult = parseQRCode(result);
      // Store the scan result in the app state
      if (parsedResult.type === QRCodeType.ALGORAND_APP_ID) {
        appState.selectApplication(parsedResult.value);
      } else if (parsedResult.type === QRCodeType.ALGORAND_ADDRESS) {
        appState.setWalletAddress(parsedResult.value);
      }
      // Close the scanner
      isOpen = false;
    } catch (error) {
       // Store raw result if parsing fails
      isOpen = false;
    }
  }
  
  // Handle closing the scanner
  function handleClose() {
    isOpen = false;
  }
  
  // Export method to open scanner for other components to use
  export function openScanner() {
    isOpen = true;
  }
</script>

{#if isOpen}
  <QRCodeScanner onScan={handleScan} onClose={handleClose} />
{/if} 
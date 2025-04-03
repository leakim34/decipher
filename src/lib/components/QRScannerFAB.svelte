<script lang="ts">
  import QRIcon from './QRIcon.svelte';
  import { getContext } from 'svelte';
  
  // Get the openScanner function from context with proper type
  const openScanner = getContext<() => void>('openQRScanner');
  
  function handleClick() {
    openScanner();
  }
</script>

<button 
  class="qr-fab" 
  onclick={handleClick}
  aria-label="Scan QR Code"
  title="Scan QR Code"
>
  <QRIcon size={26} />
</button>

<style>
  .qr-fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    border-radius: 28px;
    background-color: rgba(16, 185, 129, 0.9); /* Match the emerald/teal theme */
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    z-index: 50;
    border: none;
    cursor: pointer;
    transition: transform 0.15s ease-in-out, background-color 0.15s ease-in-out;
  }
  
  .qr-fab:hover {
    transform: scale(1.05);
    background-color: rgba(20, 184, 166, 1);
  }
  
  @media (max-width: 768px) {
    .qr-fab {
      bottom: 16px;
      right: 16px;
    }
  }
</style> 
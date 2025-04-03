<script lang="ts">
  import QRIcon from './QRIcon.svelte';
  import { getContext } from 'svelte';

  let { size = 24, buttonClass = '' } = $props<{
    size?: number;
    buttonClass?: string;
  }>();

  // Get the openScanner function from context with proper type
  const openScanner = getContext<() => void>('openQRScanner');

  function handleClick() {
    openScanner();
  }
</script>

<button
  type="button"
  onclick={handleClick}
  class="qr-button {buttonClass}"
  aria-label="Scan QR Code"
  title="Scan QR Code"
>
  <QRIcon size={size} />
</button>

<style>
  .qr-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    color: white;
    border: none;
    border-radius: 0.375rem;
    padding: 0.5rem;
    cursor: pointer;
    transition: transform 0.15s ease-in-out, opacity 0.15s ease-in-out;
  }

  .qr-button:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }

  .qr-button:focus {
    outline: none;
  }

  .qr-button:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.3);
    outline-offset: 2px;
  }
</style> 
<script lang="ts">
	import '../app.css';
	import QRScannerFAB from '$lib/components/QRScannerFAB.svelte';
	import QRScannerPopup from '$lib/components/QRScannerPopup.svelte';

	import { setContext } from 'svelte';

	let { children } = $props();
	
	// Get a reference to the QRScannerPopup component
	let scannerPopup = $state<QRScannerPopup | null>(null);
	
	// Provide the openScanner function to child components via context
	setContext('openQRScanner', () => {
		if (scannerPopup) {
			scannerPopup.openScanner();
		}
	});
</script>

{@render children()}

<QRScannerFAB />
<QRScannerPopup bind:this={scannerPopup} />


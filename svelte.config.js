import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: { adapter: adapter(), alias: { $lib: './src/lib', $server: './src/lib/server', $shared: './src/lib/shared' } }
};

export default config;

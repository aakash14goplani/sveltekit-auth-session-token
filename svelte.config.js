import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		paths: {
			base: '/aakash',
			relative: true
		},
		adapter: adapter(),
		alias: {
			$src: './src',
			$lib: './src/lib'
		}
	},
	compilerOptions: {
		enableSourcemap: true
	},
	vitePlugin: {
		inspector: {
			holdMode: true,
			showToggleButton: 'always',
			toggleButtonPos: 'bottom-left'
		}
	}
};

export default config;

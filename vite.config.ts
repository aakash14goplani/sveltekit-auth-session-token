import dotenv from 'dotenv';
import { defineConfig, loadEnv } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

dotenv.config();

export default defineConfig(({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
	return {
		plugins: [sveltekit()],
		build: {
			sourcemap: true
		}
	};
});

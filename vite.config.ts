import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), purgeCss()],
	optimizeDeps: {
		exclude: ['@node-rs/argon2', '@node-rs/bcrypt']
	}
});

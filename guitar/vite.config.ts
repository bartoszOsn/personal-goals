import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
	plugins: [
		react(),
		dts({
			include: ['src'],
			tsconfigPath: './tsconfig.build.json'
		})
	],
	build: {
		lib: {
			entry: {
				theme: resolve(__dirname, 'src/theme/index.scss'),
				button: resolve(__dirname, 'src/components/button/index.ts'),
				appLayout: resolve(__dirname, 'src/components/app-layout/index.ts'),
			},
			formats: ['es']
		},
		rollupOptions: {
			external: ['react', 'react/jsx-runtime', 'react-dom'],
		},
		cssCodeSplit: true,
		copyPublicDir: false
	}
});

import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
	  react(),
	  checker({
		  typescript: {
			  tsconfigPath: 'tsconfig.app.json',
		  },
		  eslint: {
			  lintCommand: 'eslint .',
			  useFlatConfig: true,
		  }
	  })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
	server: {
	  proxy: {
		  '/api': {
			  target: 'http://localhost:3000',
			  rewrite: path => path.replace(/^\/api/, '')
		  }
	  }
	}
})

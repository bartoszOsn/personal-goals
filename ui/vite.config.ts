import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import 'dotenv/config';

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
	},
	define: defineEnv([
		'FIREBASE_API_KEY',
		'FIREBASE_AUTH_DOMAIN',
		'FIREBASE_PROJECT_ID',
		'FIREBASE_STORAGE_BUCKET',
		'FIREBASE_MESSAGING_SENDER_ID',
		'FIREBASE_APP_ID'
	])
})

function defineEnv(variables: string[]): Record<string, string> {
	return Object.fromEntries(
		variables.map(variable => {
			const value = process.env[variable];

			if (!value) {
				throw new Error(`Required environment variable not defined: ${JSON.stringify(variable)}`);
			}

			return [`process.env.${variable}`, JSON.stringify(value)];
		})
	)
}
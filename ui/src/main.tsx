import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from '@/App.tsx';
import { HttpError } from '@/base/http';

declare module '@tanstack/react-query' {
	interface Register {
		defaultError: HttpError;
	}
}


createRoot(document.getElementById("root")!).render(
  <StrictMode>
	  <App />
  </StrictMode>
)

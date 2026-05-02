import { ReactNode } from 'react';

export interface AppLayoutMainProps {
	children?: ReactNode;
}

export function AppLayoutMain({ children }: AppLayoutMainProps) {
	return (
		<main className={`gui-app-layout__main`}>
			{children}
		</main>
	)
}
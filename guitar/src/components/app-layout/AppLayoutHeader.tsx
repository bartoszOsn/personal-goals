import { ReactNode } from 'react';

export interface AppLayoutHeaderProps {
	children?: ReactNode;
}

export function AppLayoutHeader({ children }: AppLayoutHeaderProps) {
	return (
		<header className={`gui-app-layout__header`}>
			{children}
		</header>
	)
}
import { ReactNode } from 'react';

export interface AppLayoutSidebarProps {
	children?: ReactNode;
}

export function AppLayoutSidebar({ children }: AppLayoutSidebarProps) {
	return (
		<nav className={`gui-app-layout__sidebar`}>
			{children}
		</nav>
	)
}
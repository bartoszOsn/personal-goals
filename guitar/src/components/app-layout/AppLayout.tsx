import './AppLayout.scss';
import { ReactNode } from 'react';

export interface AppLayoutProps {
	children?: ReactNode;
	fullHeight?: boolean;
}

export function AppLayout({
	children,
	fullHeight = false
}: AppLayoutProps) {
	return (
		<div className={`gui-app-layout ${fullHeight ? 'gui-app-layout--full-height' : ''}`}>
			{children}
		</div>
	)
}
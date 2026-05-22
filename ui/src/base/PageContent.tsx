import { ReactNode } from 'react';
import { SidebarTrigger } from '@/primitive/components/ui/sidebar.tsx';

export function PageContent({ children }: { children: ReactNode }) {
	return (
		<main className='min-w-0 flex-1'>
			{children}
		</main>
	);
}

export function PageContentHeader({ children }: { children: ReactNode }) {
	return (
		<header className='sticky top-0 bg-background/50 flex flex-row gap-4 items-center z-40 px-4 py-2 backdrop-blur-md border-b'>
			<SidebarTrigger />
			{children}
		</header>
	)
}

export function PageContentContent({ children }: { children: ReactNode }) {
	return (
		<section className='p-4'>
			{children}
		</section>
	)
}
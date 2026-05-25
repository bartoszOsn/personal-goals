import { ReactNode, useEffect, useState } from 'react';
import { SidebarTrigger } from '@/primitive/components/ui/sidebar.tsx';
import { cn } from '@/primitive/lib/utils';

export function PageContent({ children }: { children: ReactNode }) {
	return (
		<main className='min-w-0 flex-1'>
			{children}
		</main>
	);
}

export function PageContentHeader({ children }: { children: ReactNode }) {
	const [isHidden, setIsHidden] = useState(true);

	useEffect(() => {
		const abort = new AbortController();

		let lastScrollPosition = document.documentElement.scrollTop;

		document.addEventListener('scroll', () => {
			const currentScrollPosition = document.documentElement.scrollTop;
			const isScrollingDown = currentScrollPosition > lastScrollPosition;
			lastScrollPosition = currentScrollPosition;
			setIsHidden(isScrollingDown || currentScrollPosition === 0);
		}, { signal: abort.signal, passive: true });

		return () => {
			abort.abort();
		}
	}, []);

	return (
		<header className={cn(
			'sticky bg-background/50 flex flex-row gap-4 items-center z-40 px-4 py-2 backdrop-blur-md border-b transition-[top] duration-300',
				isHidden ? '-top-full' : 'top-0'
			)}>
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
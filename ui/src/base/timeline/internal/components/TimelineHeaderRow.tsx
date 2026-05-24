import { ReactNode } from 'react';

export function TimelineHeaderRow({
	children
}: {
	children: ReactNode
}) {
	return (
		<div className="border-b flex flex-row flex-nowrap bg-accent min-h-8 sticky top-0">
			{children}
		</div>
	);
}
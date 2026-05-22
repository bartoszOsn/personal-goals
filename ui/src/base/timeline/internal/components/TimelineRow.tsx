import { ReactNode } from 'react';

export function TimelineRow({
	children
}: {
	children: ReactNode
}) {
	return (
		<div className='not-last:border-b flex flex-row flex-nowrap bg-accent min-h-8'>
			{children}
		</div>
	)
}
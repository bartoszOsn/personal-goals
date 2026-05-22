import { ReactNode } from 'react';

export function TimelineRowChart({ children }: { children: ReactNode }) {
	return (
		<div className='flex-1 relative'>
			{children}
		</div>
	)
}
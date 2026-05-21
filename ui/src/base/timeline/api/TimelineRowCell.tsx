import { ReactNode } from 'react';
import { timelineTableWidthCssPropertyName } from '@/base/timeline/internal/timelineTableWidthCssPropertyName.ts';

export function TimelineRowCell({ children }: { children: ReactNode }) {
	return (
		<div className='sticky left-0 border-r bg-background z-10' style={{ width: `var(${timelineTableWidthCssPropertyName})` }}>
			{children}
		</div>
	)
}
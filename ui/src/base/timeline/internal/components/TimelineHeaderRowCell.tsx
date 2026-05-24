import { ReactNode } from 'react';
import { timelineTableWidthCssPropertyName } from '@/base/timeline/internal/timelineTableWidthCssPropertyName.ts';

export function TimelineHeaderRowCell(
	{ children }:
	{ children?: ReactNode }
) {
	return (
		<div className='sticky left-0 border-r bg-background z-10 flex flex-row flex-nowrap overflow-hidden' style={{ width: `var(${timelineTableWidthCssPropertyName})` }}>
			<div className='flex-1 overflow-hidden'>
				{children}
			</div>
		</div>
	)
}
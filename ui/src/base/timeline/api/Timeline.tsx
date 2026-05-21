import { timelineScaleToPxPerDay } from '@/base/timeline/internal/timelineScaleToPx.ts';
import { CSSProperties, ReactNode, RefAttributes, useState } from 'react';
import { Slot } from 'radix-ui';
import { Temporal } from 'temporal-polyfill';
import { timelineTableWidthCssPropertyName } from '@/base/timeline/internal/timelineTableWidthCssPropertyName';

export function Timeline({
	children,
	startDate,
	endDate,
	...divProps
}: {
	children: ReactNode;
	startDate: Temporal.PlainDate;
	endDate: Temporal.PlainDate;
} & RefAttributes<HTMLDivElement>) {
	const [scale, setScale] = useState<keyof typeof timelineScaleToPxPerDay>('sm');
	const width = startDate.until(endDate).total('days') * timelineScaleToPxPerDay[scale];
	const timelineTableWidth = 300;
	const timelineTableWidthPx = `${timelineTableWidth}px`;

	return (
		<Slot.Root className='relative overflow-x-auto border rounded' style={{ [timelineTableWidthCssPropertyName]: timelineTableWidthPx} as CSSProperties}>
			<div {...divProps}>
				<div style={{ width }}>
					{children}
				</div>
			</div>
		</Slot.Root>
	)
}
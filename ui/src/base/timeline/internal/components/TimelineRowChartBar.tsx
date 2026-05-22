import { ReactNode } from 'react';
import { Temporal } from 'temporal-polyfill';
import { timelineScaleToPxPerDay } from '@/base/timeline/internal/timelineScaleToPx.ts';
import { plainDateToPxOffset } from '@/base/timeline/internal/plainDateToPxOffset.ts';
import { durationToPx } from '@/base/timeline/internal/durationToPx.ts';

export function TimelineRowChartBar(
	{ children, posStart, posEnd, startDate, scale }:
	{ children: ReactNode, posStart: Temporal.PlainDate, posEnd: Temporal.PlainDate, startDate: Temporal.PlainDate, scale: keyof typeof timelineScaleToPxPerDay }
) {
	const left = plainDateToPxOffset(posStart, scale, startDate);
	const width = durationToPx(posStart.until(posEnd), scale);

	return (
		<div className='h-6 bg-background border rounded absolute left-12 top-1/2 -translate-1/2' style={{ left, width }}>
			{children}
		</div>
	)
}
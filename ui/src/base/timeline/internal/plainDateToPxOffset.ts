import { timelineScaleToPxPerDay } from '@/base/timeline/internal/timelineScaleToPx.ts';
import { Temporal } from 'temporal-polyfill';
import { durationToPx } from '@/base/timeline/internal/durationToPx.ts';

export function plainDateToPxOffset(
	date: Temporal.PlainDate,
	scale: keyof typeof timelineScaleToPxPerDay,
	startDate: Temporal.PlainDate,
): number {
	return durationToPx(startDate.until(date), scale);
}
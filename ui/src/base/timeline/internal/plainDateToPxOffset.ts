import { timelineScaleToPxPerDay } from '@/base/timeline/internal/timelineScaleToPx.ts';
import { Temporal } from 'temporal-polyfill';
import { durationToPx, pxToDuration } from '@/base/timeline/internal/durationToPx.ts';

export function plainDateToPxOffset(
	date: Temporal.PlainDate,
	scale: keyof typeof timelineScaleToPxPerDay,
	startDate: Temporal.PlainDate,
): number {
	return durationToPx(startDate.until(date), scale);
}

export function pxOffsetToPlainDate(
	offset: number,
	scale: keyof typeof timelineScaleToPxPerDay,
	startDate: Temporal.PlainDate,
): Temporal.PlainDate {
	return startDate.add(pxToDuration(offset, scale));
}
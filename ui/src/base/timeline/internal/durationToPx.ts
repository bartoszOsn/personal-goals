import { Temporal } from 'temporal-polyfill';
import { timelineScaleToPxPerDay } from '@/base/timeline/internal/timelineScaleToPx.ts';

export function durationToPx(duration: Temporal.Duration, scale: keyof typeof timelineScaleToPxPerDay): number {
	return duration.total('days') * timelineScaleToPxPerDay[scale];
}
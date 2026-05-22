import { Temporal } from 'temporal-polyfill';

export function formatTimeRange(start: Temporal.PlainDate, end: Temporal.PlainDate): string {
	return Intl.DateTimeFormat(undefined, {
		day: '2-digit',
		month: 'short',
		timeZone: 'UTC'
	}).formatRange(
		new Date(Date.UTC(start.year, start.month - 1, start.day)),
		new Date(Date.UTC(end.year, end.month - 1, end.day))
	);
}
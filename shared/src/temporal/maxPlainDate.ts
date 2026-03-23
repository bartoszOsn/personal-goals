import { Temporal } from 'temporal-polyfill';
import { isPlainDate } from './isPlainDate.js';

export function maxPlainDate(...dates: Temporal.PlainDate[]) {
	return dates.reduce(
		(maxDate: Temporal.PlainDate, date: Temporal.PlainDate) => isPlainDate(date).after(maxDate) ? date : maxDate,
		Temporal.PlainDate.from({ year: 0, month: 1, day: 1 }),
	);
}
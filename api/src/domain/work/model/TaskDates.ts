import { Temporal } from 'temporal-polyfill';

export class TaskDates {
	constructor(
		public readonly start: Temporal.PlainDate,
		public readonly end: Temporal.PlainDate
	) {}
}

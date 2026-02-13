import { SprintId } from './SprintId';
import { TimeRange } from './TimeRange';
import { Temporal } from 'temporal-polyfill';

export class SprintTimeRange extends TimeRange {
	constructor(
		public readonly id: SprintId,
		startDate: Temporal.PlainDate,
		endDate: Temporal.PlainDate
	) {
		super(startDate, endDate);
	}
}

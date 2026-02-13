import { Year } from './Year';
import { Quarter } from './Quarter';
import { SprintStatus } from './SprintStatus';
import { SprintId } from './SprintId';
import { SprintTimeRange } from './SprintTimeRange';
import { Temporal } from 'temporal-polyfill';

export class Sprint extends SprintTimeRange {
	constructor(
		id: SprintId,
		public readonly year: Year,
		public readonly quarter: Quarter,
		public readonly yearlyIndex: number,
		startDate: Temporal.PlainDate,
		endDate: Temporal.PlainDate,
		public readonly status: SprintStatus
	) {
		super(id, startDate, endDate);
	}
}

import { Year } from './Year';
import { Quarter } from './Quarter';
import { SprintStatus } from './SprintStatus';
import { SprintId } from './SprintId';

export class Sprint {
	constructor(
		public readonly id: SprintId,
		public readonly year: Year,
		public readonly quarter: Quarter,
		public readonly yearlyIndex: number,
		public readonly start: Date,
		public readonly end: Date,
		public readonly status: SprintStatus
	) {}
}

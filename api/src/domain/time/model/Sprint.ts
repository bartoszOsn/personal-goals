import { Year } from './Year';
import { Quarter } from './Quarter';
import { SprintStatus } from './SprintStatus';

export class Sprint {
	constructor(
		public readonly year: Year,
		public readonly quarter: Quarter,
		public readonly yearlyIndex: number,
		public readonly start: Date,
		public readonly end: Date,
		public readonly status: SprintStatus
	) {}
}

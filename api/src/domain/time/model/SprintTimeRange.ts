import { SprintId } from './SprintId';

export class SprintTimeRange {
	constructor(
		public readonly id: SprintId,
		public readonly startDate: Date,
		public readonly endDate: Date
	) {}
}

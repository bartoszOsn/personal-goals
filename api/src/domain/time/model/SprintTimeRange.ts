import { SprintId } from './SprintId';
import { TimeRange } from './TimeRange';

export class SprintTimeRange extends TimeRange {
	constructor(
		public readonly id: SprintId,
		startDate: Date,
		endDate: Date
	) {
		super(startDate, endDate);
	}
}

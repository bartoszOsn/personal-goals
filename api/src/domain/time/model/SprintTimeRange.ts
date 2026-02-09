import { SprintId } from './SprintId';

export class SprintTimeRange {
	constructor(
		public readonly id: SprintId,
		public readonly startDate: Date,
		public readonly endDate: Date
	) {}

	overlaps(other: SprintTimeRange) {
		const otherHaveStartInside =
			other.startDate >= this.startDate &&
			other.startDate <= this.endDate;
		const otherHaveEndInside =
			other.endDate >= this.startDate && other.endDate <= this.endDate;
		const thisInsideOther =
			this.startDate >= other.startDate && this.endDate <= other.endDate;
		return otherHaveStartInside || otherHaveEndInside || thisInsideOther;
	}
}

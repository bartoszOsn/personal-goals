export class TimeRange {
	constructor(
		public readonly startDate: Date,
		public readonly endDate: Date
	) {}

	overlaps(other: TimeRange) {
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

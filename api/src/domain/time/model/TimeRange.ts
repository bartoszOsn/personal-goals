import { Temporal } from 'temporal-polyfill';

export class TimeRange {
	constructor(
		public readonly startDate: Temporal.PlainDate,
		public readonly endDate: Temporal.PlainDate
	) {}

	overlaps(other: TimeRange) {
		const otherHaveStartInside =
			Temporal.PlainDate.compare(other.startDate, this.startDate) >= 0 &&
			Temporal.PlainDate.compare(other.startDate, this.endDate) <= 0;
		const otherHaveEndInside =
			Temporal.PlainDate.compare(other.endDate, this.startDate) >= 0 &&
			Temporal.PlainDate.compare(other.endDate, this.endDate) <= 0;
		const thisInsideOther =
			Temporal.PlainDate.compare(this.startDate, other.startDate) >= 0 &&
			Temporal.PlainDate.compare(this.endDate, other.endDate) <= 0;
		return otherHaveStartInside || otherHaveEndInside || thisInsideOther;
	}
}

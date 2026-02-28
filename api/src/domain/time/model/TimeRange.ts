import { Temporal } from 'temporal-polyfill';
import { isPlainDate } from '@personal-okr/shared';

export class TimeRange {
	constructor(
		public readonly startDate: Temporal.PlainDate,
		public readonly endDate: Temporal.PlainDate
	) {}

	overlaps(other: TimeRange) {
		const otherHaveStartInside =
			isPlainDate(other.startDate).afterOrEqual(this.startDate) &&
			isPlainDate(other.startDate).beforeOrEqual(this.endDate);
		const otherHaveEndInside =
			isPlainDate(other.endDate).afterOrEqual(this.startDate) &&
			isPlainDate(other.endDate).beforeOrEqual(this.endDate);
		const thisInsideOther =
			isPlainDate(this.startDate).afterOrEqual(other.startDate) &&
			isPlainDate(this.endDate).beforeOrEqual(other.endDate);
		return otherHaveStartInside || otherHaveEndInside || thisInsideOther;
	}
}

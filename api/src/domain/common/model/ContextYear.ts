import { Temporal } from 'temporal-polyfill';
import { isPlainDate } from '@personal-okr/shared';

export class ContextYear {
	constructor(public year: number) {}

	equals(other: ContextYear) {
		return this.year === other.year;
	}

	getStartDate(): Temporal.PlainDate {
		return Temporal.PlainDate.from({ year: this.year, month: 1, day: 1 });
	}

	getEndDate(): Temporal.PlainDate {
		return Temporal.PlainDate.from({ year: this.year, month: 12, day: 31 });
	}

	doesIncludeDate(date: Temporal.PlainDate): boolean {
		return (
			isPlainDate(date).after(this.getStartDate()) &&
			isPlainDate(date).before(this.getEndDate())
		);
	}
}

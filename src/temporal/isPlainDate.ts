import { Temporal } from 'temporal-polyfill';

export function isPlainDate(a: Temporal.PlainDate): TemporalComparator {
	return new TemporalComparatorImpl(a);
}

export interface TemporalComparator {
	before(b: Temporal.PlainDate): boolean;
	beforeOrEqual(b: Temporal.PlainDate): boolean;
	after(b: Temporal.PlainDate): boolean;
	afterOrEqual(b: Temporal.PlainDate): boolean;
	equals(b: Temporal.PlainDate): boolean;
	notEquals(b: Temporal.PlainDate): boolean;
}

class TemporalComparatorImpl implements TemporalComparator {
	public readonly a: Temporal.PlainDate;
	constructor(a: Temporal.PlainDate) {
		this.a = a;
	}

	before(b: Temporal.PlainDate) {
		return Temporal.PlainDate.compare(this.a, b) < 0;
	}

	beforeOrEqual(b: Temporal.PlainDate) {
		return Temporal.PlainDate.compare(this.a, b) <= 0;
	}

	after(b: Temporal.PlainDate) {
		return Temporal.PlainDate.compare(this.a, b) > 0;
	}

	afterOrEqual(b: Temporal.PlainDate) {
		return Temporal.PlainDate.compare(this.a, b) >= 0;
	}

	equals(b: Temporal.PlainDate) {
		return Temporal.PlainDate.compare(this.a, b) === 0;
	}

	notEquals(b: Temporal.PlainDate) {
		return Temporal.PlainDate.compare(this.a, b) !== 0;
	}
}
import { ContextYear } from '../../common/model/ContextYear';
import { Temporal } from 'temporal-polyfill';
import { SprintId } from './SprintId';
import { isPlainDate } from '@personal-okr/shared';
import { Quarter } from '../../common/model/Quarter';
import { SprintStatus } from './SprintStatus';

export abstract class Sprint {
	private _index: number;

	constructor(
		public readonly id: SprintId,
		public readonly context: ContextYear,
		public readonly startDate: Temporal.PlainDate,
		public readonly endDate: Temporal.PlainDate
	) {}

	get index(): number {
		return this._index;
	}

	protected setIndex(value: number) {
		this._index = value;
	}

	get quarter(): Quarter {
		const middle = this.startDate.add({
			days: Math.round(
				this.endDate.since(this.startDate).total('days') / 2
			)
		});

		if (
			isPlainDate(middle).before(
				Temporal.PlainDate.from({
					year: this.context.year,
					month: 4,
					day: 1
				})
			)
		) {
			return Quarter.Q1;
		} else if (
			isPlainDate(middle).before(
				Temporal.PlainDate.from({
					year: this.context.year,
					month: 7,
					day: 1
				})
			)
		) {
			return Quarter.Q2;
		} else if (
			isPlainDate(middle).before(
				Temporal.PlainDate.from({
					year: this.context.year,
					month: 10,
					day: 1
				})
			)
		) {
			return Quarter.Q3;
		} else {
			return Quarter.Q4;
		}
	}

	get name(): string {
		return `${this.context.year}-${this.quarter}-${(this.index + 1).toString().padStart(2, '0')}`;
	}

	getStatus(now: Temporal.PlainDate): SprintStatus {
		if (isPlainDate(now).after(this.endDate)) {
			return SprintStatus.COMPLETED;
		}
		if (isPlainDate(now).before(this.startDate)) {
			return SprintStatus.FUTURE;
		}

		return SprintStatus.ACTIVE;
	}

	overlapWithRange(start: Temporal.PlainDate, end: Temporal.PlainDate) {
		return !(
			isPlainDate(start).after(this.endDate) ||
			isPlainDate(end).before(this.startDate)
		);
	}
}

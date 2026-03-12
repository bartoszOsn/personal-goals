import { ContextYear } from '../../common/model/ContextYear';
import { Temporal } from 'temporal-polyfill';
import { SprintId } from './SprintId';
import { isPlainDate } from '@personal-okr/shared';

export abstract class Sprint {
	constructor(
		public readonly id: SprintId,
		public readonly context: ContextYear,
		public readonly startDate: Temporal.PlainDate,
		public readonly endDate: Temporal.PlainDate
	) {}

	overlapWithRange(start: Temporal.PlainDate, end: Temporal.PlainDate) {
		return !(
			isPlainDate(start).after(this.endDate) ||
			isPlainDate(end).before(this.startDate)
		);
	}
}

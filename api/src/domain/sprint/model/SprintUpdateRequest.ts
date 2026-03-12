import { SprintId } from './SprintId';
import { Temporal } from 'temporal-polyfill';

export class SprintUpdateRequest {
	constructor(
		public readonly id: SprintId,
		public readonly newStartDate?: Temporal.PlainDate,
		public readonly newEndDate?: Temporal.PlainDate
	) {}
}

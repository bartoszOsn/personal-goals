import { TaskId } from './TaskId';
import { RichText } from './RichText';
import { TaskStatus } from './TaskStatus';
import { SprintId } from '../../time/model/SprintId';
import { Temporal } from 'temporal-polyfill';
import { KeyResultId } from './KeyResult';

export class Task {
	constructor(
		public readonly id: TaskId,
		public readonly name: string,
		public readonly description: RichText,
		public readonly status: TaskStatus,
		public readonly startDate: Temporal.PlainDate | null,
		public readonly endDate: Temporal.PlainDate | null,
		public readonly sprints: SprintId[],
		public readonly keyResultId: KeyResultId | null
	) {}
}

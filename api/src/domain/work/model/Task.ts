import { TaskId } from './TaskId';
import { RichText } from './RichText';
import { TaskDates } from './TaskDates';
import { TaskStatus } from './TaskStatus';
import { SprintId } from '../../time/model/SprintId';

export class Task {
	constructor(
		public readonly id: TaskId,
		public readonly name: string,
		public readonly description: RichText,
		public readonly status: TaskStatus,
		public readonly dates: TaskDates | null,
		public readonly sprints: SprintId[]
	) {}
}

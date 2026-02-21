import { RichText } from './RichText';
import { KeyResultProgress } from './KeyResultProgress';
import { TaskId } from './TaskId';

export class KeyResultRequest {
	constructor(
		public readonly name: string | null,
		public readonly description: RichText | null,
		public readonly progress: KeyResultProgress | null,
		public readonly associatedTasks: KeyResultAssociatedTasksRequest[]
	) {}
}

export class KeyResultAssociatedTasksRequest {
	constructor(
		public readonly type: 'clear' | 'add' | 'delete',
		public readonly ids?: TaskId[]
	) {}
}

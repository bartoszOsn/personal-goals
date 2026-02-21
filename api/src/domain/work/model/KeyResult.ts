import { RichText } from './RichText';
import { KeyResultProgress } from './KeyResultProgress';
import { TaskId } from './TaskId';

export class KeyResult {
	constructor(
		public readonly id: KeyResultId,
		public readonly name: string,
		public readonly description: RichText,
		public readonly progress: KeyResultProgress,
		public readonly associatedTasks: TaskId[]
	) {}
}

export class KeyResultId {
	constructor(public readonly id: string) {}
}

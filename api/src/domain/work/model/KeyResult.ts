import { RichText } from './RichText';
import { KeyResultProgress } from './KeyResultProgress';
import { TaskId } from './TaskId';
import { TaskStatus } from './TaskStatus';
import { KeyResultProgressCalculator } from './KeyResultProgressCalculator';
import { ProgressCalculationType } from './ProgressCalculationType';

export class KeyResult {
	constructor(
		public readonly id: KeyResultId,
		public readonly name: string,
		public readonly description: RichText,
		public readonly progress: KeyResultProgress,
		public readonly associatedTasks: TaskId[],
		public readonly associatedTasksStatuses: TaskStatus[]
	) {}

	getCalculatedProgress(): number {
		return KeyResultProgressCalculator.calculateProgress(
			this.progress.calculationType,
			this.progress.progress,
			this.associatedTasksStatuses
		);
	}
}

export class KeyResultId {
	constructor(public readonly id: string) {}
}

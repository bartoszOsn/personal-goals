import { ProgressCalculationType } from './ProgressCalculationType';
import { TaskStatus } from './TaskStatus';

export class KeyResultProgressCalculator {
	static calculateProgress(
		calculationType: ProgressCalculationType,
		manualProgress: number,
		associatedTasksStatuses: TaskStatus[]
	): number {
		switch (calculationType) {
			case ProgressCalculationType.YES_NO:
			case ProgressCalculationType.PERCENTAGE:
				return manualProgress;
			case ProgressCalculationType.TASKS:
				return this.calculateProgressFromTasks(associatedTasksStatuses);
		}
	}

	private static calculateProgressFromTasks(
		taskStatuses: TaskStatus[]
	): number {
		if (taskStatuses.length === 0) {
			return 0;
		}

		const doneTasks = taskStatuses.filter(
			(status) => status === TaskStatus.DONE
		).length;

		return doneTasks / taskStatuses.length;
	}
}

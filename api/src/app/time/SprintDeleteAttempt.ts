export class SprintDeleteSuccessAttempt {
	readonly isSuccess: boolean = true;
}

export class SprintDeleteAssignedTasksFailureAttempt {
	readonly isSuccess: boolean = false;
	constructor(public readonly assignedTasks: []) {} // TODO: change to Task[] when tasks will be implemented.
}

export type SprintDeleteAttempt =
	| SprintDeleteSuccessAttempt
	| SprintDeleteAssignedTasksFailureAttempt;

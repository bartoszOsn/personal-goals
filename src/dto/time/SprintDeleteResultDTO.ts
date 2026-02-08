export type SprintDeleteResultDTO = SprintDeleteSuccessDTO | SprintChangeTasksAssignedFailureDTO;

export interface SprintDeleteSuccessDTO {
	status: 'success';
}

export interface SprintChangeTasksAssignedFailureDTO {
	status: 'failure';
	reason: 'task-assigned';
	assignedTasks: []; // TODO: change to TaskListDTO when tasks will be implemented.
}
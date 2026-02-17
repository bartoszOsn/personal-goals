export interface TaskDTO {
	readonly id: string;
	readonly name: string;
	readonly description: string;
	readonly status: TaskStatusDTO;
	readonly startDate?: string;
	readonly endDate?: string;
	readonly sprintIds: string[];
}

export type TaskStatusDTO = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'FAILED';
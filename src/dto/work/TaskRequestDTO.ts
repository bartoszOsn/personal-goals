export interface TaskRequestDTO {
	readonly name: string;
	readonly description: string;
	readonly status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'FAILED';
	readonly startDate?: string;
	readonly endDate?: string;
	readonly sprintIds: string[];
}

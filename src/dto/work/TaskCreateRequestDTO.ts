export interface TaskCreateRequestDTO {
	readonly name: string;
	readonly description: string;
	readonly status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'FAILED';
	readonly dates: {
		readonly start: string;
		readonly end: string;
	} | null;
	readonly sprintIds: string[];
}

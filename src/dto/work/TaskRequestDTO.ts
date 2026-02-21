export interface TaskRequestDTO {
	readonly name?: string;
	readonly description?: string;
	readonly status?: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'FAILED';
	readonly startDate?: { empty: true } | { value: string };
	readonly endDate?: { empty: true } | { value: string };
	readonly sprintIds?: string[];
	readonly keyResult?: { empty: true } | { value: string };
}

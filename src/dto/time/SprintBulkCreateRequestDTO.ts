export interface SprintBulkCreateRequestDTO {
	startDate: string;
	numberOfSprints: number;
	sprintDuration: 'week' | 'two-weeks' | 'month';
}
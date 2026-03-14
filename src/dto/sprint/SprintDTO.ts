export interface SprintDTO {
	id: string;
	name: string;
	context: number;
	quarter: 1 | 2 | 3 | 4;
	startDate: string;
	endDate: string;
	readonly status: 'completed' | 'active' | 'future';
}
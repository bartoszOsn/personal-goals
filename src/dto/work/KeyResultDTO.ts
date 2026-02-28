export interface KeyResultDTO {
	id: string;
	name: string;
	description: string;
	progress: number;
	progressCalculationType: 'YES_NO' | 'PERCENTAGE' | 'TASKS';
	associatedTaskIds: string[];
}

export interface KeyResultRequestDTO {
	name?: string;
	description?: string;
	progress?: number;
	progressCalculationType?: 'YES_NO' | 'PERCENTAGE' | 'TASKS';
	associatedTasks?: ({ type: 'clear' } | { type: 'add', ids: string[] } | { type: 'delete', ids: string[] })[];
}

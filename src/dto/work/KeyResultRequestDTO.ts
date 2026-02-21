export interface KeyResultRequestDTO {
	name?: string;
	description?: string;
	progress?: number;
	associatedTasks?: ({ type: 'clear' } | { type: 'add', ids: string[] } | { type: 'delete', ids: string[] })[];
}

import { TaskId } from '@/models/Task';

export interface KeyResult {
	id: KeyResultId;
	name: string;
	description: string;
	progress: number;
	progressCalculationType: ProgressCalculationType;
	associatedTaskIds: TaskId[];
}

export interface KeyResultRequest {
	name?: string;
	description?: string;
	progress?: number;
	progressCalculationType?: ProgressCalculationType;
	associatedTasks?: never; // TODO: Implement this field on backend
}

export type KeyResultId = string & { __brand: 'KeyResultId' };

export enum ProgressCalculationType {
	YES_NO = 'YES_NO',
	PERCENTAGE = 'PERCENTAGE',
	TASKS = 'TASKS'
}
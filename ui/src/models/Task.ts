import { Temporal } from 'temporal-polyfill';
import { SprintId } from '@/models/Sprint.ts';
import { KeyResultId } from '@/models/KeyResult.ts';

export interface Task {
	readonly id: TaskId;
	readonly name: string;
	readonly description: string;
	readonly status: TaskStatus;
	readonly startDate: Temporal.PlainDate | null;
	readonly endDate: Temporal.PlainDate | null;
	readonly sprintIds: SprintId[];
	readonly keyResultId: KeyResultId | null;
}

export interface TaskRequest {
	readonly name?: string;
	readonly description?: string;
	readonly status?: TaskStatus;
	readonly startDate?: Temporal.PlainDate | null;
	readonly endDate?: Temporal.PlainDate | null;
	readonly sprintIds?: SprintId[];
	readonly keyResultId?: KeyResultId | null;
}

export type TaskId = string & { __brand: 'TaskId' };

export enum TaskStatus {
	TODO = 'TODO',
	IN_PROGRESS = 'IN_PROGRESS',
	DONE = 'DONE',
	FAILED = 'FAILED'
}
import { Temporal } from 'temporal-polyfill';
import { SprintId } from '@/models/Sprint';
import { Quarter } from '@/models/Quarter';

export interface WorkItem {
	readonly id: WorkItemId;
	readonly type: WorkItemType;
	readonly contextYear: number;
	readonly title: string;
	readonly description: string;
	readonly timeFrame: WorkItemTimeFrame | null;
	readonly status: WorkItemStatus;
	readonly progress: WorkItemProgress;
	readonly children: WorkItem[];
}

export interface WorkItemCreationRequest {
	readonly context: number;
	readonly type: WorkItemType;
	readonly parentId?: WorkItemId;
	readonly fields?: WorkItemUpdateRequest;
}

export interface WorkItemUpdateRequest {
	readonly contextYear?: number;
	readonly type?: WorkItemType;
	readonly title?: string;
	readonly description?: string;
	readonly timeFrame?: WorkItemTimeFrame | null;
	readonly status?: WorkItemStatus;
	readonly progress?: number;
}

export type WorkItemId = string & { __brand: 'WorkItemId' };

export enum WorkItemType {
	TASK = 'task',
	OBJECTIVE = 'objective',
	KEY_RESULT = 'keyResult'
}

export enum WorkItemStatus {
	TODO = 'todo',
	IN_PROGRESS = 'inProgress',
	DONE = 'done',
	FAILED = 'failed'
}

export interface WorkItemProgress {
	readonly progress: number;
	readonly canChange: boolean;
}

export interface WorkItemTimeFrameBase {
	readonly startDate: Temporal.PlainDate;
	readonly endDate: Temporal.PlainDate;
	readonly context: number;
}

export interface WholeYearWorkItemTimeFrame extends WorkItemTimeFrameBase {
	readonly type: WorkItemTimeFrameType.WHOLE_YEAR;
}

export interface QuarterWorkItemTimeFrame extends WorkItemTimeFrameBase {
	readonly type: WorkItemTimeFrameType.QUARTER;
	readonly quarter: Quarter;
}

export interface CustomDateWorkItemTimeFrame extends WorkItemTimeFrameBase {
	readonly type: WorkItemTimeFrameType.CUSTOM_DATE;
}

export interface SprintWorkItemTimeFrame extends WorkItemTimeFrameBase {
	readonly type: WorkItemTimeFrameType.SPRINT;
	readonly sprintId: SprintId;
}

export enum WorkItemTimeFrameType {
	WHOLE_YEAR = 'whole-year',
	QUARTER = 'quarter',
	CUSTOM_DATE = 'custom-date',
	SPRINT = 'sprint'
}

export type WorkItemTimeFrame =
	| WholeYearWorkItemTimeFrame
	| QuarterWorkItemTimeFrame
	| CustomDateWorkItemTimeFrame
	| SprintWorkItemTimeFrame;

import { Task } from '@/models/Task.ts';
import { Objective } from '@/models/Objective.ts';
import { KeyResult } from '@/models/KeyResult.ts';

export type WorkItemVariant =
	| WorkItemTaskVariant
	| WorkItemObjectiveVariant
	| WorkItemKeyResultVariant;

export type WorkItemTaskVariant = { task: Task };
export type WorkItemObjectiveVariant = { objective: Objective };
export type WorkItemKeyResultVariant = { keyResult: KeyResult };
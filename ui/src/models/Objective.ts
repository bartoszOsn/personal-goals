import { KeyResult } from '@/models/KeyResult.ts';
import { Quarter } from '@/models/Quarter.ts';

export interface Objective {
	id: ObjectiveId;
	name: string;
	description: string;
	deadline: ObjectiveDeadline;
	KeyResults: KeyResult[];
}

export interface ObjectiveRequest {
	name?: string;
	description?: string;
	deadline?: ObjectiveDeadline;
}

export type ObjectiveId = string & { __brand: 'ObjectiveId' };

export interface ObjectiveDeadline {
	year: number;
	quarter: Quarter | null;
}
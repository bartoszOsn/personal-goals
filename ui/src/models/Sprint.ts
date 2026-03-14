import { Temporal } from 'temporal-polyfill';
import { Quarter } from '@/models/Quarter';

export interface Sprint {
	readonly id: SprintId;
	readonly year: number;
	readonly quarter: Quarter;
	readonly name: string;
	readonly startDate: Temporal.PlainDate;
	readonly endDate: Temporal.PlainDate;
	readonly status: SprintStatus;
}

export interface SprintChangeRequest {
	[sprintId: SprintId]: {
		newStartDate?: Temporal.PlainDate;
		newEndDate?: Temporal.PlainDate;
	}
}

export type SprintId = string & { __brand: 'SprintId' };

export enum SprintStatus {
	COMPLETED = 'COMPLETED',
	ACTIVE = 'ACTIVE',
	FUTURE = 'FUTURE'
}

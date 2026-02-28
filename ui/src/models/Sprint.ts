import { Temporal } from 'temporal-polyfill';

export interface Sprint {
	readonly id: SprintId;
	readonly year: number;
	readonly quarter: Quarter;
	readonly yearlyIndex: number;
	readonly startDate: Temporal.PlainDate;
	readonly endDate: Temporal.PlainDate;
	readonly status: SprintStatus;
}

export interface SprintChangeRequest {
	[sprintId: SprintId]: {
		newStartDate: Temporal.PlainDate;
		newEndDate: Temporal.PlainDate;
	}
}

export interface SprintBulkCreateRequest {
	startDate: Temporal.PlainDate;
	numberOfSprints: number;
	sprintDuration: SprintDuration;
}

export type SprintId = string & { __brand: 'SprintId' };

export enum Quarter {
	Q1 = 'Q1',
	Q2 = 'Q2',
	Q3 = 'Q3',
	Q4 = 'Q4'
}

export enum SprintStatus {
	COMPLETED = 'COMPLETED',
	ACTIVE = 'ACTIVE',
	FUTURE = 'FUTURE'
}

export enum SprintDuration {
	WEEK = 'WEEK',
	TWO_WEEKS = 'TWO_WEEKS',
	MONTH = 'MONTH'
}
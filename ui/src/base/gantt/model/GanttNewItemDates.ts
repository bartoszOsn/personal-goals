import { Temporal } from 'temporal-polyfill';

export interface GanttNewItemDates {
	startDate: Temporal.PlainDate;
	endDate: Temporal.PlainDate;
}
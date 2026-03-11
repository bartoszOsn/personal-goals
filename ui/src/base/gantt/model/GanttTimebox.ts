import { MantineColor } from '@mantine/core';
import { Temporal } from 'temporal-polyfill';

export interface GanttTimebox {
	label: string;
	color: MantineColor;
	startDate: Temporal.PlainDate;
	endDate: Temporal.PlainDate;
}
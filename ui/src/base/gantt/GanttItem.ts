import type { MantineColor } from '@mantine/core';
import { Temporal } from 'temporal-polyfill';

export interface GanttItem<TData> {
	id: string;
	name: string;
	color: MantineColor;
	start: Temporal.PlainDate;
	end: Temporal.PlainDate;
	data: TData;
	linksInto: string[];
}
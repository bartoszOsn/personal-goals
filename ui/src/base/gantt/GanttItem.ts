import { MantineColor } from '@mantine/core';
import { Temporal } from 'temporal-polyfill';

export interface GanttItem<TData> {
	id: string;
	color: MantineColor;
	start?: Temporal.PlainDate;
	end?: Temporal.PlainDate;
	data: TData;
	linksInto: string[];
	children: GanttItem<TData>[];
	tooltip?: string;
	backgroundColor?: MantineColor;
}
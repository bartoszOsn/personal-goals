import type { MantineColor } from '@mantine/core';

export interface GanttItem<TData> {
	id: string;
	name: string;
	color: MantineColor;
	start: Date;
	end: Date;
	data: TData;
	linksInto: string[];
}
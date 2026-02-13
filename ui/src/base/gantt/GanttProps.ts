import type { GanttItem } from '@/base/gantt/GanttItem.ts';
import type { GroupProps } from '@mantine/core';

export interface GanttProps<TData> {
	items: GanttItem<TData>[];
	containerProps?: GroupProps;
	selectedItemIds?: string[];
	setSelectedItemIds?: (itemIds: string[]) => void;
}
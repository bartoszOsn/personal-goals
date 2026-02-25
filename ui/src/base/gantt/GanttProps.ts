import type { GanttItem } from '@/base/gantt/GanttItem.ts';
import type { GroupProps } from '@mantine/core';
import type { GanttNewItemDates } from '@/base/gantt/model/GanttNewItemDates';

export interface GanttProps<TData> {
	items: GanttItem<TData>[];
	containerProps?: GroupProps;
	selectedItemIds?: string[];
	setSelectedItemIds?: (itemIds: string[]) => void;
	changeDates?: (items: Map<string, GanttNewItemDates>) => Promise<void>;
}

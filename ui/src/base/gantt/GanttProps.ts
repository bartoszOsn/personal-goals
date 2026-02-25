import type { GanttItem } from '@/base/gantt/GanttItem.ts';
import type { GroupProps } from '@mantine/core';
import type { GanttNewItemDates } from '@/base/gantt/model/GanttNewItemDates';
import type { ColumnDescriptor } from '@/base/data-table';

export interface GanttProps<TData> {
	items: GanttItem<TData>[];
	containerProps?: GroupProps;
	setSelectedItemIds?: (itemIds: string[]) => void;
	changeDates?: (items: Map<string, GanttNewItemDates>) => Promise<void>;
	possibleColumns: ColumnDescriptor<GanttItem<TData>, string>[];
	initialColumnIds: string[];
	ganttKey: string;
}

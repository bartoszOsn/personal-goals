import { GanttItem } from '@/base/gantt/GanttItem.ts';
import { GroupProps } from '@mantine/core';
import { GanttNewItemDates } from '@/base/gantt/model/GanttNewItemDates';
import { ColumnDescriptor } from '@/base/data-table';

export interface GanttProps<TData> {
	items: GanttItem<TData>[];
	containerProps?: GroupProps;
	setSelectedItemIds?: (itemIds: string[]) => void;
	changeDates?: (items: Map<string, GanttNewItemDates>) => Promise<void>;
	possibleColumns: ColumnDescriptor<GanttItem<TData>, string>[];
	initialColumnIds: string[];
	ganttKey: string;
}

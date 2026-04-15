import { GanttItem } from '@/base/gantt/GanttItem.ts';
import { GroupProps, MantineBreakpoint } from '@mantine/core';
import { GanttNewItemDates } from '@/base/gantt/model/GanttNewItemDates';
import { ColumnDescriptor, DataTableRowMoveProps } from '@/base/data-table';
import { ReactNode } from 'react';
import { Temporal } from 'temporal-polyfill';
import { GanttTimebox } from '@/base/gantt/model/GanttTimebox';
import { PropertyStorage } from '@/base/property-storage/propertyStorage';

export interface GanttProps<TData> {
	items: GanttItem<TData>[];
	containerProps?: GroupProps;
	setSelectedItemIds?: (itemIds: string[]) => void;
	changeDates?: (items: Map<string, GanttNewItemDates>) => Promise<void>;
	possibleColumns: ColumnDescriptor<GanttItem<TData>>[];
	initialColumnIds: string[];
	ganttKey: string;
	bounds?: [start: Temporal.PlainDate, end: Temporal.PlainDate];
	timeboxes?: GanttTimebox[];
	renderContextMenu?: (openedOn: GanttItem<TData>, selected: GanttItem<TData>[]) => ReactNode;
	rowMove?: DataTableRowMoveProps<GanttItem<TData>, string>;
	storage?: PropertyStorage;
	hideChartWithScreenSmallerThan?: MantineBreakpoint;
}

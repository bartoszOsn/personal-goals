import { Temporal } from 'temporal-polyfill';
import { type GanttItem } from '@/base/gantt';
import type { GanttNewItemDates } from '@/base/gantt/model/GanttNewItemDates';

export type DragData = {
	status: 'idle'
} | {
	status: 'dragging' | 'dragging-left' | 'dragging-right',
	start: Temporal.PlainDate,
	current: Temporal.PlainDate,
	draggedItems: GanttItem<unknown>[]
} | {
	status: 'resolving',
	optimisticDates: Map<string, GanttNewItemDates>
}
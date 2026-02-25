import type { GanttItem } from '@/base/gantt/GanttItem';

export function flatItems<TData>(items: GanttItem<TData>[]): GanttItem<TData>[] {
	const result: GanttItem<TData>[] = [];
	for (const item of items) {
		result.push(item);
		result.push(...flatItems(item.children));
	}
	return result;
}
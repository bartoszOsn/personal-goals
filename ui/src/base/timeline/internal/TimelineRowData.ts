import { Key } from 'react';
import { BaseTimelineItem, DeepHierarchyTimelineItem, FlatHierarchyTimelineItem } from '@/base/timeline/api/TimelineProps.ts';

export interface TimelineRowData<TId extends Key, TData> {
	id: TId;
	item: BaseTimelineItem<TId, TData>;
	parent: TimelineRowData<TId, TData> | null;
	children: TimelineRowData<TId, TData>[];
	level: number;
	collapsed: boolean;
	visible: boolean;
}

export function flatHierarchyItemsToRowData<TId extends Key, TData>(items: FlatHierarchyTimelineItem<TId, TData>[]): TimelineRowData<TId, TData>[] {
	return items.map(item => ({
		id: item.id,
		item,
		parent: null,
		children: [],
		level: 0,
		collapsed: false,
		visible: true
	}));
}

export function deepHierarchyItemsToRowData<TId extends Key, TData>(
	items: DeepHierarchyTimelineItem<TId, TData>[],
	collapsedIds: TId[]
): TimelineRowData<TId, TData>[] {
	const result: TimelineRowData<TId, TData>[] = [];
	deepHierarchyItemsToRowDataRecursive(items, null, result, collapsedIds);
	return result;
}

function deepHierarchyItemsToRowDataRecursive<TId extends Key, TData>(
	items: DeepHierarchyTimelineItem<TId, TData>[],
	parent: TimelineRowData<TId, TData> | null,
	fullArray: TimelineRowData<TId, TData>[],
	collapsedIds: TId[]
): TimelineRowData<TId, TData>[] {
	return items.map(item => {
		const result: TimelineRowData<TId, TData> = {
			id: item.id,
			item,
			parent: parent,
			children: [],
			level: parent ? parent.level + 1 : 0,
			collapsed: collapsedIds.includes(item.id),
			visible: parent ? parent.visible && !parent.collapsed : true
		};
		fullArray.push(result);

		if (item.children && item.children.length > 0) {
			for (const child of deepHierarchyItemsToRowDataRecursive(item.children, result, fullArray, collapsedIds)) {
				result.children.push(child);
			}
		}

		return result;
	});
}
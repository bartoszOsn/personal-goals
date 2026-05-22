import { Key } from 'react';
import { BaseTimelineItem, DeepHierarchyTimelineItem, FlatHierarchyTimelineItem } from '@/base/timeline/api/TimelineProps.ts';

export interface TimelineRowData<TId extends Key, TData> {
	id: TId;
	item: BaseTimelineItem<TId, TData>;
	parent: TimelineRowData<TId, TData> | null;
	children: TimelineRowData<TId, TData>[];
	level: number;
}

export function flatHierarchyItemsToRowData<TId extends Key, TData>(items: FlatHierarchyTimelineItem<TId, TData>[]): TimelineRowData<TId, TData>[] {
	return items.map(item => ({
		id: item.id,
		item,
		parent: null,
		children: [],
		level: 0
	}));
}

export function deepHierarchyItemsToRowData<TId extends Key, TData>(items: DeepHierarchyTimelineItem<TId, TData>[]): TimelineRowData<TId, TData>[] {
	return deepHierarchyItemsToRowDataRecursive(items, null);
}

function deepHierarchyItemsToRowDataRecursive<TId extends Key, TData>(items: DeepHierarchyTimelineItem<TId, TData>[], parent: TimelineRowData<TId, TData> | null): TimelineRowData<TId, TData>[] {
	return items.map(item => {
		const result: TimelineRowData<TId, TData> = {
			id: item.id,
			item,
			parent: parent,
			children: [],
			level: parent ? parent.level + 1 : 0
		};

		if (item.children) {
			for (const child of deepHierarchyItemsToRowDataRecursive(item.children, result)) {
				result.children.push(child);
			}
		}

		return result;
	});
}
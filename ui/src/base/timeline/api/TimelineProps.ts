import { Key, ReactNode, RefAttributes } from 'react';
import { Temporal } from 'temporal-polyfill';

export type TimelineProps<TId extends Key, TData> =
	& BaseTimelineProps<TId, TData>
	& (
		FlatHierarchyTimelineProps<TId, TData>
		| DeepHierarchyTimelineProps<TId, TData>
	);

export interface BaseTimelineProps<TId extends Key, TData>  {
	startDate: Temporal.PlainDate;
	endDate: Temporal.PlainDate;
	rootProps?: RefAttributes<HTMLDivElement>;
	onDatesChange?: (itemId: TId, newDates: {from: Temporal.PlainDate, to: Temporal.PlainDate}) => Promise<void> | void;
	timeboxes?: TimelineTimebox[];
	renderCell: (data: TData) => ReactNode;
	renderBar?: (data: TData) => ReactNode;
	onSelectionChange?: (selectedRows: TId[]) => void;
}

export interface FlatHierarchyTimelineProps<TId extends Key, TData> {
	flatHierarchyItems: FlatHierarchyTimelineItem<TId, TData>[];
	onMove?: (movePayload: FlatHierarchyTimelineMovePayload<TId>) => Promise<void> | void;
}

export interface DeepHierarchyTimelineProps<TId extends Key, TData> {
	deepHierarchyItems: DeepHierarchyTimelineItem<TId, TData>[];
	onMove?: (movePayload: DeepHierarchyTimelineMovePayload<TId>) => Promise<void> | void;
	canBeParent?: (childCandidate: TData, parentCandidate: TData) => boolean;
}

export interface BaseTimelineItem<TId extends Key, TData> {
	id: TId;
	data: TData;
	dates?: { from: Temporal.PlainDate; to: Temporal.PlainDate };
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FlatHierarchyTimelineItem<TId extends Key, TData> extends BaseTimelineItem<TId, TData> {

}

export interface DeepHierarchyTimelineItem<TId extends Key, TData> extends BaseTimelineItem<TId, TData> {
	children?: DeepHierarchyTimelineItem<TId, TData>[];
}

export interface FlatHierarchyTimelineMovePayload<TId extends Key> {
	itemId: TId;
	precedingItemId: TId | null;
	succeedingItemId: TId | null;
}

export interface DeepHierarchyTimelineMovePayload<TId extends Key> {
	itemId: TId;
	newParentId: TId | null;
	precedingItemId: TId | null;
	succeedingItemId: TId | null;
}

export interface TimelineTimebox {
	id: string;
	startDate: Temporal.PlainDate;
	endDate: Temporal.PlainDate;
	name: string;
}
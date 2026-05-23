import { createDragAndDropContext, DragAndDropContext } from '@/base/dnd/api/createDragAndDropContext.ts';
import { Key } from 'react';
import { TimelineRowData } from '@/base/timeline/internal/TimelineRowData';

const timelineDnDContext = createDragAndDropContext<unknown, unknown>();

export function getTimelineDnDContext<TId extends Key, TData>(): DragAndDropContext<TimelineRowData<TId, TData>, TimelineDropPayload<TId, TData>> {
	return timelineDnDContext as DragAndDropContext<TimelineRowData<TId, TData>, TimelineDropPayload<TId, TData>>;
}

export type TimelineDropPayload<TId extends Key, TData> =
	| { dropBelow: TimelineRowData<TId, TData> }
	| { dropAbove: TimelineRowData<TId, TData> }
	| { dropInto: TimelineRowData<TId, TData> }
	| null;
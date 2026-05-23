import { DragAndDropContext } from '@/base/dnd/api/createDragAndDropContext.ts';
import { useState } from 'react';
import { useMonitorDrag } from '@/base/dnd/api/useMonitorDrag.ts';

export function useDragPayload<TDragPayload, TDropPayload>(
	context: DragAndDropContext<TDragPayload, TDropPayload>
) {
	const [dragPayload, setDragPayload] = useState<TDragPayload | null>(null);

	useMonitorDrag(context, (dragPayload) => {
		setDragPayload(dragPayload);
	});

	return dragPayload;
}
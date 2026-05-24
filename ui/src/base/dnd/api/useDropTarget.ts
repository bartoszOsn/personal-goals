import { DragAndDropContext } from '@/base/dnd/api/createDragAndDropContext.ts';
import { useState } from 'react';
import { useMonitorDrag } from '@/base/dnd/api/useMonitorDrag.ts';

export function useDropTarget<TDragPayload, TDropPayload>(
	context: DragAndDropContext<TDragPayload, TDropPayload>
) {
	const [dropTarget, setDropTarget] = useState<TDropPayload | null>(null);

	useMonitorDrag(context, (_dragPayload, dropPayload) => {
		setDropTarget(dropPayload);
	});

	return dropTarget;
}
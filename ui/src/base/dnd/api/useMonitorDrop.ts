import { DragAndDropContext } from '@/base/dnd/api/createDragAndDropContext.ts';
import { useEffect, useRef } from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

export function useMonitorDrop<TDragPayload, TDropPayload>(
	context: DragAndDropContext<TDragPayload, TDropPayload>,
	callback: (dragPayload: TDragPayload | null, dropPayload: TDropPayload | null) => void,
) {
	const lastCallParametersRef = useRef<{ dragPayload: TDragPayload | null, dropPayload: TDropPayload | null}>({ dragPayload: null, dropPayload: null });

	useEffect(() => {
		callback(lastCallParametersRef.current.dragPayload, lastCallParametersRef.current.dropPayload);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	
	useEffect(() => {
		return monitorForElements({
			onDrop: (args) => {
				if (!context.isMatchingDragPayload(args.source.data)) {
					callback(null, null);
					return;
				}
				
				const dragPayload = context.unwrapDragPayload(args.source.data);

				const dropPayloadWrapped = args.location.current.dropTargets.find((target) => context.isMatchingDropPayload(target.data))?.data;
				
				if (!dropPayloadWrapped || !context.isMatchingDropPayload(dropPayloadWrapped)) {
					callback(dragPayload, null);
					return;
				}
				
				const dropPayload = context.unwrapDropPayload(dropPayloadWrapped);
				callback(dragPayload, dropPayload);
			},
		})
	}, [callback, context]);
}
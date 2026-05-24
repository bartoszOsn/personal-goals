import { DragAndDropContext } from '@/base/dnd/api/createDragAndDropContext.ts';
import { useEffect, useRef } from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { BaseEventPayload } from '@atlaskit/pragmatic-drag-and-drop/types';
import { ElementDragType } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';

export function useMonitorDrag<TDragPayload, TDropPayload>(
	context: DragAndDropContext<TDragPayload, TDropPayload>,
	callback: (dragPayload: TDragPayload | null, dropPayload: TDropPayload | null) => void,
) {
	const lastCallParametersRef = useRef<{ dragPayload: TDragPayload | null, dropPayload: TDropPayload | null}>({ dragPayload: null, dropPayload: null });

	useEffect(() => {
		callback(lastCallParametersRef.current.dragPayload, lastCallParametersRef.current.dropPayload);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	
	useEffect(() => {
		const invokeThrottledCallback = (dragPayload: TDragPayload | null, dropPayload: TDropPayload | null) => {
			if (dragPayload !== lastCallParametersRef.current.dragPayload || dropPayload !== lastCallParametersRef.current.dropPayload) {
				lastCallParametersRef.current = { dragPayload, dropPayload };
				callback(dragPayload, dropPayload);
			}
		}

		const onDrag = (args: BaseEventPayload<ElementDragType>) => {
			if (!context.isMatchingDragPayload(args.source.data)) {
				invokeThrottledCallback(null, null);
				return;
			}

			const dragPayload = context.unwrapDragPayload(args.source.data);

			const dropPayloadWrapped = args.location.current.dropTargets.find((target) => context.isMatchingDropPayload(target.data))?.data;

			if (!dropPayloadWrapped || !context.isMatchingDropPayload(dropPayloadWrapped)) {
				invokeThrottledCallback(dragPayload, null);
				return;
			}

			const dropPayload = context.unwrapDropPayload(dropPayloadWrapped);
			invokeThrottledCallback(dragPayload, dropPayload);
		}
		
		return monitorForElements({
			onDropTargetChange: onDrag,
			onDragStart: onDrag,
			onDrag: onDrag,
			onDrop: () => { invokeThrottledCallback(null, null); },
		})
	}, [callback, context]);
}
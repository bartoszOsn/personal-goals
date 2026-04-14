import { Center, Divider } from '@mantine/core';
import { useEffect, useRef } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useGanttContext } from '@/base/gantt/GanttProvider';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { preventUnhandled } from '@atlaskit/pragmatic-drag-and-drop/prevent-unhandled';
import { BaseEventPayload, ElementDragType } from '@atlaskit/pragmatic-drag-and-drop/types';

const ratioKey = 'tableToChartRatio';

export function GanttDivider() {
	const context = useGanttContext<unknown>();
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		context.props.storage?.getItem<number>(ratioKey)
			.then((ratio) => {
				if (ratio !== null) {
					context.setTableToChartRatio(ratio);
				}
			})
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!ref.current) return;

		const onDrag = (e: BaseEventPayload<ElementDragType>) => {
			const rootBounds = context.rootContainerRef.current!.getBoundingClientRect();
			const xRelativeToRoot = e.location.current.input.clientX - rootBounds.left;

			const ratio = xRelativeToRoot / rootBounds.width;
			context.setTableToChartRatio(ratio);
			return ratio;
		}

		return draggable({
			element: ref.current,
			onDrag: (e) => {
				onDrag(e);
			},
			onGenerateDragPreview: (e) => {
				disableNativeDragPreview(e);
				preventUnhandled.start();
			},
			onDrop: (e) => {
				const ratio = onDrag(e);
				context.props.storage?.setItem(ratioKey, ratio);
				preventUnhandled.stop();
			}
		});
	}, [context]);

	return (
		<Center ref={ref} w='var(--mantine-spacing-lg)' style={{ alignSelf: 'stretch', cursor: 'ew-resize'}}>
			<Divider orientation='vertical' />
		</Center>
	)
}
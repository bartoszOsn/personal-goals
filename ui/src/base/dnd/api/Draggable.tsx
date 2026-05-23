import { ForwardedRef, ReactNode, useEffect, useRef, useState } from 'react';
import { Slot } from 'radix-ui';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { cn } from '@/primitive/lib/utils.ts';
import { useMergedRefs } from '@/base/util/useMergedRefs';
import { DragAndDropContext } from '@/base/dnd/api/createDragAndDropContext';
import { genericForwardRef } from '@/base/util/genericForwardRef';

export const Draggable = genericForwardRef(<TDragPayload, TDropPayload>({
	children,
	context,
	data,
	className
}: {
	children: ReactNode,
	context: DragAndDropContext<TDragPayload, TDropPayload>,
	data: TDragPayload,
	className?: string
}, ref: ForwardedRef<HTMLElement | null>) => {
	const elementRef = useRef<HTMLElement>(null);
	const mergedRef = useMergedRefs(ref, elementRef);
	const [isDragging, setIsDragging] = useState(false);

	useEffect(() => {
		if (!elementRef.current) {
			return;
		}

		const dragHandle = elementRef.current.querySelector('[data-drag-handle]') ?? undefined;
		return draggable({
			element: elementRef.current,
			dragHandle: dragHandle,
			getInitialData: () => context.wrapDragPayload(data),
			onDragStart: () => {
				setIsDragging(true);
			},
			onDrop: () => {
				setIsDragging(false);
			}
		});
	}, [data, context]);

	return (
		<Slot.Root ref={mergedRef} className={cn(className, { 'opacity-50': isDragging })}>
			{children}
		</Slot.Root>
	);
});
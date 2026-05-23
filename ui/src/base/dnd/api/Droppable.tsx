import { ForwardedRef, HTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';
import { Slot } from 'radix-ui';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { cn } from '@/primitive/lib/utils.ts';
import { useMergedRefs } from '@/base/util/useMergedRefs';
import { DragAndDropContext } from '@/base/dnd/api/createDragAndDropContext';
import { genericForwardRef } from '@/base/util/genericForwardRef';
import { Input } from '@atlaskit/pragmatic-drag-and-drop/types';

export const Droppable = genericForwardRef(<TDragPayload, TDropPayload>({
	children,
	getData,
	canDrop = () => true,
	context,
	isSticky = true,
	withBorderIndicator = true,
	className,
	...htmlAttributes
}: {
	children: ReactNode,
	getData: (draggedData: TDragPayload, dropTargetElement: Element, input: Input) => TDropPayload,
	canDrop?: (draggedData: TDragPayload) => boolean
	context: DragAndDropContext<TDragPayload, TDropPayload>,
	isSticky?: boolean
	withBorderIndicator?: boolean
} & HTMLAttributes<HTMLElement>, ref: ForwardedRef<HTMLElement | null>) => {
	const elementRef = useRef<HTMLElement>(null);
	const mergedRef = useMergedRefs(ref, elementRef);
	const [isDropTarget, setIsDropTarget] = useState(false);

	useEffect(() => {
		if (!elementRef.current) {
			return;
		}

		return dropTargetForElements({
			element: elementRef.current,
			canDrop: (args) => {
				if (!context.isMatchingDragPayload(args.source.data)) {
					return false;
				}
				const draggedData = context.unwrapDragPayload(args.source.data);
				return canDrop(draggedData);
			},
			onDragEnter: () => {
				setIsDropTarget(true);
			},
			onDragLeave: () => setIsDropTarget(false),
			onDrop: () => setIsDropTarget(false),
			getData: (args) => {
				if (!context.isMatchingDragPayload(args.source.data)) {
					throw new Error('Invalid drag payload for drop target');
				}

				const draggedData = context.unwrapDragPayload(args.source.data);
				const dropData = getData(draggedData, args.element, args.input);
				return context.wrapDropPayload(dropData);
			},
			getIsSticky: () => isSticky
		});
	}, [canDrop, context, getData, isSticky]);

	return (
		<Slot.Root ref={mergedRef} {...htmlAttributes} className={cn(className, { 'outline outline-accent-foreground': withBorderIndicator && isDropTarget })}>
			{children}
		</Slot.Root>
	);
});
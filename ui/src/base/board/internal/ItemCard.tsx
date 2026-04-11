import { BoardColumnDefinition } from '@/base/board';
import { Box, Card, Center } from '@mantine/core';
import { useAtomValue, useSetAtom } from 'jotai';
import { getBoardAtoms } from '@/base/board/internal/state/getBoardAtoms';
import { useEffect, useRef } from 'react';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';

export function ItemCard<TColumnId, TData>(props: { column: BoardColumnDefinition<TColumnId>, item: TData, index: number }) {
	const boardProps = useAtomValue(getBoardAtoms<TData, TColumnId>().propsAtom);

	const ref = useRef<HTMLDivElement>(null);
	const upperDropTargetRef = useRef<HTMLDivElement>(null);
	const lowerDropTargetRef = useRef<HTMLDivElement>(null);

	const draggedItem = useAtomValue(getBoardAtoms<TData, TColumnId>().draggedItemAtom);
	const dragStart = useSetAtom(getBoardAtoms<TData, TColumnId>().dragStartActionAtom);
	const setDraggedItemDropTarget = useSetAtom(getBoardAtoms<TData, TColumnId>().dropTargetItemAtom);
	const dropAction = useSetAtom(getBoardAtoms<TData, TColumnId>().dropActionAtom);

	useEffect(() => {
		if (!ref.current || !upperDropTargetRef.current || !lowerDropTargetRef.current) return;

		return combine(
			draggable({
				element: ref.current,
				getInitialData: () => ({
					item: props.item,
					column: props.column.columnId,
				}),
				onDragStart: () => {
					dragStart(props.item);
				},
				onDrop: () => {
					dropAction();
				}
			}),
			dropTargetForElements({
				element: upperDropTargetRef.current,
				onDragEnter: () => {
					setDraggedItemDropTarget({ beforeItem: props.item })
				},
				onDragLeave: () => {
					setDraggedItemDropTarget(null);
				},
				getIsSticky: () => true
			}),
			dropTargetForElements({
				element: lowerDropTargetRef.current,
				onDragEnter: () => {
					setDraggedItemDropTarget({ afterItem: props.item })
				},
				onDragLeave: () => {
					setDraggedItemDropTarget(null);
				},
				getIsSticky: () => true
			})
		);
	}, [dropAction, props.column.columnId, props.item, dragStart, setDraggedItemDropTarget]);

	return <Card w="100%" withBorder opacity={draggedItem === props.item ? 0.5 : 1} ref={ref}>
		<Card.Section>
			<Center w="100%"
					h={2}
					bg={props.column.color ? props.column.color : 'gray'}
					style={{ cursor: 'grab' }}>
			</Center>
		</Card.Section>
		<Box>
			{boardProps.renderCard(props.item)}
		</Box>
		<Box ref={upperDropTargetRef} pos='absolute' inset="0 0 50% 0" hidden={!draggedItem} />
		<Box ref={lowerDropTargetRef} pos='absolute' inset="50% 0 0 0" hidden={!draggedItem} />
	</Card>;
}
import { BoardColumnDefinition } from '@/base/board';
import { Box, Card, Center } from '@mantine/core';
import { useAtomValue, useSetAtom } from 'jotai';
import { getBoardAtoms } from '@/base/board/internal/state/getBoardAtoms';
import { useEffect, useRef } from 'react';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { createHitboxMatcher } from '@/base/pragmatic-dnd-x/crateHitboxMatcher';

export function ItemCard<TColumnId, TData>(props: { column: BoardColumnDefinition<TColumnId>, item: TData, index: number }) {
	const boardProps = useAtomValue(getBoardAtoms<TData, TColumnId>().propsAtom);

	const ref = useRef<HTMLDivElement>(null);

	const draggedItem = useAtomValue(getBoardAtoms<TData, TColumnId>().draggedItemAtom);
	const dragStart = useSetAtom(getBoardAtoms<TData, TColumnId>().dragStartActionAtom);
	const setDraggedItemDropTarget = useSetAtom(getBoardAtoms<TData, TColumnId>().dropTargetItemAtom);
	const dropAction = useSetAtom(getBoardAtoms<TData, TColumnId>().dropActionAtom);

	useEffect(() => {
		if (!ref.current) return;

		const matchHitbox = createHitboxMatcher({
			top: {
				top: 0,
				left: 0,
				right: 0,
				bottom: { percent: 50 }
			},
			bottom: {
				top: { percent: 50 },
				left: 0,
				right: 0,
				bottom: 0
			}
		});

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
				element: ref.current,
				onDrag: (e) => {
					const hitbox = matchHitbox(e.self.element, e.location.current.input);

					if (hitbox === 'top') {
						setDraggedItemDropTarget({ beforeItem: props.item });
					} else if (hitbox === 'bottom') {
						setDraggedItemDropTarget({ afterItem: props.item });
					}
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
	</Card>;
}
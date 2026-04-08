import { BoardColumnDefinition } from '@/base/board';
import { Button, Card, Stack, Text } from '@mantine/core';
import { ItemCard } from '@/base/board/internal/ItemCard.tsx';
import { IconPlus } from '@tabler/icons-react';
import { useDroppable } from '@dnd-kit/react';
import { CollisionPriority } from '@dnd-kit/abstract';
import { useAtomValue, useSetAtom } from 'jotai';
import { getBoardAtoms } from '@/base/board/internal/state/getBoardAtoms';

export function BoardColumn<TData, TColumnId>(props: {
	column: BoardColumnDefinition<TColumnId>,
	groupedItemIds: Record<string, string[]>
}) {
	const boardProps = useAtomValue(getBoardAtoms<TData, TColumnId>().propsAtom);
	const itemsInColumn = boardProps.items
		.filter(item => props.groupedItemIds[`${props.column.columnId}`]?.includes(boardProps.itemIdSelector(item)));
	const createItem = useSetAtom(getBoardAtoms<TData, TColumnId>().createItemActionAtom);
	const isCreateButtonPending = useAtomValue(getBoardAtoms<TData, TColumnId>().createButtonPendingAtom);

	const { ref, isDropTarget } = useDroppable({
		id: `${props.column.columnId}`,
		type: 'column',
		accept: 'item',
		collisionPriority: CollisionPriority.Low,
		data: {
			column: props.column
		}
	});

	return <Card w={boardProps.columnWidth}
				 ref={ref}
				 withBorder
				 style={{ flexShrink: 0 }}
				 bg={props.column.color ? `${props.column.color}.1` : 'gray.1'}
				 styles={{ root: { borderColor: isDropTarget ? 'var(--mantine-color-blue-5)' : undefined } }}
				 pos="relative">
		<Stack w="100%">
			<Text fw={500}>{props.column.name}</Text>
			{
				itemsInColumn.map((item, index) => <ItemCard key={boardProps.itemIdSelector(item)} item={item} index={index} column={props.column} />)
			}
			{
				itemsInColumn.length === 0 && (
					<Text c={'dimmed'}>{boardProps.noItemsInColumnText}</Text>
				)
			}
			<Button variant="light" color={props.column.color ?? 'gray'} leftSection={<IconPlus />} loading={isCreateButtonPending} onClick={() => createItem(props.column.columnId)}>
				{boardProps.createButtonText}
			</Button>
		</Stack>
	</Card>;
}
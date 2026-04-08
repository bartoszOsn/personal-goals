import { BoardColumnDefinition } from '@/base/board';
import { Button, Card, Stack, Text } from '@mantine/core';
import { ItemCard } from '@/base/board/internal/ItemCard.tsx';
import { IconPlus } from '@tabler/icons-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { getBoardAtoms } from '@/base/board/internal/state/getBoardAtoms';

export function BoardColumn<TData, TColumnId>(props: {
	column: BoardColumnDefinition<TColumnId>
}) {
	const boardProps = useAtomValue(getBoardAtoms<TData, TColumnId>().propsAtom);
	const actualGroupedItemIds = useAtomValue(getBoardAtoms<TData, TColumnId>().actualGroupedItemIdsAtom);
	const itemsInColumn = boardProps.items
		.filter(item => actualGroupedItemIds[`${props.column.columnId}`]?.includes(boardProps.itemIdSelector(item)));
	const createItem = useSetAtom(getBoardAtoms<TData, TColumnId>().createItemActionAtom);
	const isCreateButtonPending = useAtomValue(getBoardAtoms<TData, TColumnId>().createButtonPendingAtom);

	return <Card w={boardProps.columnWidth}
				 withBorder
				 style={{ flexShrink: 0 }}
				 bg={props.column.color ? `${props.column.color}.1` : 'gray.1'}
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
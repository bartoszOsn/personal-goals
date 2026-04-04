import { BoardColumnDefinition, BoardProps } from '@/base/board';
import { Button, Card, Stack, Text } from '@mantine/core';
import { ItemCard } from '@/base/board/internal/ItemCard.tsx';
import { IconPlus } from '@tabler/icons-react';

export function BoardColumn<TData, TColumnId>(props: {
	column: BoardColumnDefinition<TColumnId>,
	loading: boolean,
	onCreateBtnClick: () => Promise<void>,
	boardProps: BoardProps<TData, TColumnId>
}) {
	const itemsInColumn = props.boardProps.items
		.filter(item => props.boardProps.itemColumnSelector(item) === props.column.columnId);

	return <Card w={props.boardProps.columnWidth}
				 withBorder
				 style={{ flexShrink: 0 }}
				 bg={props.column.color ? `${props.column.color}.1` : 'gray.1'}
				 pos="relative">
		<Stack w="100%">
			<Text fw={500}>{props.column.name}</Text>
			{
				itemsInColumn.map((item, index) => <ItemCard key={index} item={item} column={props.column} boardProps={props.boardProps} />)
			}
			{
				itemsInColumn.length === 0 && (
					<Text c={'dimmed'}>{props.boardProps.noItemsInColumnText}</Text>
				)
			}
			<Button variant="light" color={props.column.color ?? 'gray'} leftSection={<IconPlus />} loading={props.loading} onClick={props.onCreateBtnClick}>
				{props.boardProps.createButtonText}
			</Button>
		</Stack>
	</Card>;
}
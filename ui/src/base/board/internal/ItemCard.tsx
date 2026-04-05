import { BoardColumnDefinition, BoardProps } from '@/base/board';
import { Box, Card, Center } from '@mantine/core';
import { useSortable } from '@dnd-kit/react/sortable';

export function ItemCard<TColumnId, TData>(props: { column: BoardColumnDefinition<TColumnId>, item: TData, index: number, boardProps: BoardProps<TData, TColumnId> }) {
	const { ref } = useSortable({
		id: props.boardProps.itemIdSelector(props.item),
		index: props.index,
		type: 'item',
		accept: 'item',
		group: `${props.column.columnId}`,
		data: {
			item: props.item,
			column: props.column
		}
	})

	return <Card w="100%" withBorder ref={ref}>
		<Card.Section>
			<Center w="100%"
					h={2}
					bg={props.column.color ? props.column.color : 'gray'}
					style={{ cursor: 'grab' }}>
			</Center>
		</Card.Section>
		<Box>
			{props.boardProps.renderCard(props.item)}
		</Box>
	</Card>;
}
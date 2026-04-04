import { BoardColumnDefinition, BoardProps } from '@/base/board';
import { Box, Card, Center } from '@mantine/core';
import { IconGripHorizontal } from '@tabler/icons-react';

export function ItemCard<TColumnId, TData>(props: { column: BoardColumnDefinition<TColumnId>, item: TData, boardProps: BoardProps<TData, TColumnId> }) {
	return <Card w="100%" withBorder>
		<Card.Section>
			<Center w="100%"
					h={12}
					bg={props.column.color ? props.column.color : 'gray'}
					style={{ cursor: 'grab' }}>
				<IconGripHorizontal size={8} />
			</Center>
		</Card.Section>
		<Box>
			{props.boardProps.renderCard(props.item)}
		</Box>
	</Card>;
}
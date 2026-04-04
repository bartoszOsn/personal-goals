import { BoardColumnDefinition, BoardProps } from '@/base/board';
import { Box, Card, Center } from '@mantine/core';
import { IconGripHorizontal } from '@tabler/icons-react';

export function ItemCard<TColumnId, TData>(column: BoardColumnDefinition<TColumnId>, onMouseDownOnHandle: (item: TData, initialColumn: TColumnId, e: React.MouseEvent) => void, item: TData, props: BoardProps<TData, TColumnId>) {
	return <Card w="100%" withBorder>
		<Card.Section>
			<Center w="100%"
					h={12}
					bg={column.color ? column.color : 'gray'}
					style={{ cursor: 'grab' }}
					onMouseDown={e => onMouseDownOnHandle(item, column.columnId, e)}>
				<IconGripHorizontal size={8} />
			</Center>
		</Card.Section>
		<Box>
			{props.renderCard(item)}
		</Box>
	</Card>;
}
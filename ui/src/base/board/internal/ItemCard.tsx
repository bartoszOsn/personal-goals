import { BoardColumnDefinition } from '@/base/board';
import { Box, Card, Center } from '@mantine/core';
import { useAtomValue } from 'jotai';
import { getBoardAtoms } from '@/base/board/internal/state/getBoardAtoms';

export function ItemCard<TColumnId, TData>(props: { column: BoardColumnDefinition<TColumnId>, item: TData, index: number }) {
	const boardProps = useAtomValue(getBoardAtoms<TData, TColumnId>().propsAtom);

	return <Card w="100%" withBorder>
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
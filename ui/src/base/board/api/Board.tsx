import { useState } from 'react';
import { Button, Card, Group, ScrollArea, Stack, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { BoardProps } from '@/base/board/api/BoardProps';
import { ItemCard } from '@/base/board/internal/ItemCard';

export function Board<TData, TColumnId>(props: BoardProps<TData, TColumnId>) {
	const [creationPending, setCreationPending] = useState(false);
	const createItem = async (columnId: TColumnId) => {
		setCreationPending(true);
		await props.onCreateItem(columnId);
		setCreationPending(false);
	}

	return (
		<ScrollArea.Autosize scrollbars="x" offsetScrollbars>
			<Group wrap="nowrap" align="stretch" pos="relative">
				{
					props.columns.map((column) => {
						const tasksInColumn = props.items.filter(item => props.itemColumnSelector(item) === column.columnId);

						return (
							<Card w={props.columnWidth}
								  withBorder
								  style={{ flexShrink: 0 }}
								  bg={column.color ? `${column.color}.1` : 'gray.1'}
								  pos="relative">
								<Stack w="100%">
									<Text fw={500}>{column.name}</Text>
									{
										tasksInColumn.map(item => <ItemCard item={item} column={column} boardProps={props} />)
									}
									{
										tasksInColumn.length === 0 && (
											<Text c={'dimmed'}>{props.noItemsInColumnText}</Text>
										)
									}
									<Button variant='light' color={column.color ?? 'gray'} leftSection={<IconPlus />} loading={creationPending} onClick={() => createItem(column.columnId)}>
										{props.createButtonText}
									</Button>
								</Stack>
							</Card>
						);
					})
				}
			</Group>
		</ScrollArea.Autosize>
	);
}
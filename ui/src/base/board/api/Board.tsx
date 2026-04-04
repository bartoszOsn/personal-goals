import { useState } from 'react';
import { Box, Button, Card, Center, Group, LoadingOverlay, ScrollArea, Stack, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useBoardItemDrag } from '@/base/board/internal/useBoardItemDrag';
import { BoardProps } from '@/base/board/api/BoardProps';
import { ItemCard } from '@/base/board/internal/ItemCard';

export function Board<TData, TColumnId>(props: BoardProps<TData, TColumnId>) {
	const {
		isDragging,
		isChangingColumn,
		overlayDraggedItem,
		onMouseDownOnHandle,
		onMouseUpOnTarget
	} = useBoardItemDrag(props.onColumnChange);

	const [creationPending, setCreationPending] = useState(false);
	const createItem = async (columnId: TColumnId) => {
		setCreationPending(true);
		await props.onCreateItem(columnId);
		setCreationPending(false);
	}

	return (
		<ScrollArea.Autosize scrollbars="x" offsetScrollbars>
			<Group wrap="nowrap" align="stretch" pos="relative">
				<LoadingOverlay visible={isChangingColumn} />
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
										tasksInColumn.map(item => ItemCard(column, onMouseDownOnHandle, item, props))
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
								{
									isDragging && (
										<Center pos="absolute"
												opacity={0.9}
												inset={0}
												bg={column.color ? `${column.color}.1` : 'gray.1'}
												onMouseUp={() => onMouseUpOnTarget(column.columnId)}>
											Drop here
										</Center>
									)
								}
							</Card>
						);
					})
				}
			</Group>
			{
				overlayDraggedItem && (
					<Box pos="fixed"
						 w={overlayDraggedItem.width}
						 left={overlayDraggedItem.x}
						 top={overlayDraggedItem.y}
						 opacity={0.8}
						 style={{ pointerEvents: 'none', zIndex: 9999 }}>
						{
							ItemCard(props.columns.find(c => c.columnId === overlayDraggedItem.initialColumn)!, onMouseDownOnHandle, overlayDraggedItem.item, props)
						}
					</Box>
				)
			}
		</ScrollArea.Autosize>
	);
}
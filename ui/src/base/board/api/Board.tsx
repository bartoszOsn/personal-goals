import type { BoardColumn } from '@/base/board/api/BoardColumn.ts';
import type { ReactNode } from 'react';
import { Box, Card, Center, Group, LoadingOverlay, ScrollArea, Stack, Text } from '@mantine/core';
import { IconGripHorizontal } from '@tabler/icons-react';
import { useBoardItemDrag } from '@/base/board/api/useBoardItemDrag';

export interface BoardProps<TData, TColumnId> {
	columnWidth: number;
	columns: BoardColumn<TColumnId>[];
	items: TData[];
	itemColumnSelector: (item: TData) => TColumnId;
	renderCard: (data: TData) => ReactNode;
	onColumnChange: (item: TData, newColumnId: TColumnId) => void | Promise<void>;
	noItemsInColumnText: string;
}

function ItemCard<TColumnId, TData>(column: BoardColumn<TColumnId>, onMouseDownOnHandle: (item: TData, initialColumn: TColumnId, e: React.MouseEvent) => void, item: TData, props: BoardProps<TData, TColumnId>) {
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

export function Board<TData, TColumnId>(props: BoardProps<TData, TColumnId>) {
	const {
		isDragging,
		isChangingColumn,
		overlayDraggedItem,
		onMouseDownOnHandle,
		onMouseUpOnTarget
	} = useBoardItemDrag(props.onColumnChange);

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
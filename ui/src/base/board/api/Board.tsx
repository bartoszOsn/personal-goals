import type { BoardColumn } from '@/base/board/api/BoardColumn.ts';
import type { ReactNode } from 'react';
import { Box, Card, Center, Group, ScrollArea, Stack, Text } from '@mantine/core';
import { IconGripHorizontal } from '@tabler/icons-react';

export interface BoardProps<TData, TColumnId> {
	columnWidth: number;
	columns: BoardColumn<TColumnId>[];
	items: TData[];
	itemColumnSelector: (item: TData) => TColumnId;
	renderCard: (data: TData) => ReactNode;
	onColumnChange: (item: TData, newColumnId: TColumnId) => void | Promise<void>;
	noItemsInColumnText: string;
}

export function Board<TData, TColumnId>(props: BoardProps<TData, TColumnId>) {
	return (
		<ScrollArea.Autosize scrollbars="x" offsetScrollbars>
			<Group wrap="nowrap" align="stretch">
				{
					props.columns.map((column) => {
						const tasksInColumn = props.items.filter(item => props.itemColumnSelector(item) === column.columnId);

						return (
							<Card w={props.columnWidth} withBorder style={{ flexShrink: 0 }} bg={column.color ? `${column.color}.1` : 'gray.1'}>
								<Stack w="100%">
									<Text fw={500}>{column.name}</Text>
									{
										tasksInColumn.map(item => (
											<Card w="100%" withBorder>
												<Card.Section>
													<Center w="100%"
															h={12}
															bg={column.color ? column.color : 'gray'}
															style={{ cursor: 'grab' }}>
														<IconGripHorizontal size={8} />
													</Center>
												</Card.Section>
												<Box>
													{props.renderCard(item)}
												</Box>
											</Card>
										))
									}
									{
										tasksInColumn.length === 0 && (
											<Text c={'dimmed'}>{props.noItemsInColumnText}</Text>
										)
									}
								</Stack>
							</Card>
						);
					})
				}
			</Group>
		</ScrollArea.Autosize>
	);
}
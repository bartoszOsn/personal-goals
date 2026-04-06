import { useState } from 'react';
import { Group, LoadingOverlay, ScrollArea } from '@mantine/core';
import { BoardItemMoveEvent, BoardProps } from '@/base/board/api/BoardProps';
import { BoardColumn } from '@/base/board/internal/BoardColumn';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import { BoardColumnDefinition } from '@/base/board';

export function Board<TData, TColumnId>(props: BoardProps<TData, TColumnId>) {
	const [creationPending, setCreationPending] = useState(false);
	const [isMoving, setIsMoving] = useState(false);
	const createItem = async (columnId: TColumnId) => {
		setCreationPending(true);
		await props.onCreateItem(columnId);
		setCreationPending(false);
	};

	const groupedItemIds: Record<string, string[]> = Object.fromEntries(
		props.columns.map(column => [
			`${column.columnId}`,
			props.items.filter(item => props.itemColumnSelector(item) === column.columnId)
				.map(item => props.itemIdSelector(item))
		])
	);

	const [optimisticGroupedItemIds, setOptimisticGroupedItemIds] = useState<Record<string, string[]> | null>(null);

	const actualGroupedItemIds = optimisticGroupedItemIds ?? groupedItemIds;

	return (
		<DragDropProvider
			onDragOver={(event) => {
				setOptimisticGroupedItemIds(move(actualGroupedItemIds, event));
			}}
			onDragEnd={(event) => {
				const newGroupedItemIds = move(actualGroupedItemIds, event);
				setOptimisticGroupedItemIds(newGroupedItemIds);

				if (event.canceled) {
					setOptimisticGroupedItemIds(null);
					return;
				}

				const item: TData = event.operation.source!.data.item;
				const newColumn: BoardColumnDefinition<TColumnId> = event.operation.target!.data.column;
				const newColumnItems = newGroupedItemIds[`${newColumn.columnId}`]
					.map(id => props.items.find(i => props.itemIdSelector(i) === id)!);
				const newIndexInColumn = newGroupedItemIds[`${newColumn.columnId}`].findIndex(id => id === props.itemIdSelector(item));

				const changeEvent: BoardItemMoveEvent<TData, TColumnId> = {
					item, newColumn, newIndexInColumn, newColumnItems
				}
				setIsMoving(true);
				Promise.resolve(props.onItemMove(changeEvent))
					.finally(() => {
						setOptimisticGroupedItemIds(null);
						setIsMoving(false);
					});
			}}
		>
			<ScrollArea.Autosize scrollbars="x" offsetScrollbars>
				<LoadingOverlay visible={isMoving} />
				<Group wrap="nowrap" align="stretch" pos="relative">
					{
						props.columns.map((column) => {
							return (
								<BoardColumn key={`${column.columnId}`}
											 column={column}
											 groupedItemIds={actualGroupedItemIds}
											 loading={creationPending}
											 onCreateBtnClick={() => createItem(column.columnId)}
											 boardProps={props} />
							);
						})
					}
				</Group>
			</ScrollArea.Autosize>
		</DragDropProvider>
	);
}
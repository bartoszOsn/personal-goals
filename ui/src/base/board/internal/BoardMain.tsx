import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { getBoardAtoms } from '@/base/board/internal/state/getBoardAtoms';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import { BoardColumnDefinition, BoardItemMoveEvent } from '@/base/board';
import { Group, LoadingOverlay, ScrollArea } from '@mantine/core';
import { BoardColumn } from '@/base/board/internal/BoardColumn.tsx';

export function BoardMain<TData, TColumnId>() {
	const props = useAtomValue(getBoardAtoms<TData, TColumnId>().propsAtom);
	const [isMoving, setIsMoving] = useState(false);

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
											 groupedItemIds={actualGroupedItemIds} />
							);
						})
					}
				</Group>
			</ScrollArea.Autosize>
		</DragDropProvider>
	);
}
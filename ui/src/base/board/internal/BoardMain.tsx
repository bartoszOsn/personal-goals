import { useAtomValue, useSetAtom } from 'jotai';
import { getBoardAtoms } from '@/base/board/internal/state/getBoardAtoms';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import { BoardColumnDefinition, BoardItemMoveEvent } from '@/base/board';
import { Group, LoadingOverlay, ScrollArea } from '@mantine/core';
import { BoardColumn } from '@/base/board/internal/BoardColumn.tsx';

export function BoardMain<TData, TColumnId>() {
	const props = useAtomValue(getBoardAtoms<TData, TColumnId>().propsAtom);
	const showLoadingOverlay = useAtomValue(getBoardAtoms<TData, TColumnId>().showLoadingOverlayAtom);

	const setOptimisticGroupedItemIds = useSetAtom(getBoardAtoms<TData, TColumnId>().optimisticGroupedItemIdsAtom);

	const actualGroupedItemIds = useAtomValue(getBoardAtoms<TData, TColumnId>().actualGroupedItemIdsAtom);
	const itemMoveAction = useSetAtom(getBoardAtoms<TData, TColumnId>().itemMoveActionAtom);

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
				itemMoveAction(changeEvent);
			}}
		>
			<ScrollArea.Autosize scrollbars="x" offsetScrollbars>
				<LoadingOverlay visible={showLoadingOverlay} />
				<Group wrap="nowrap" align="stretch" pos="relative">
					{
						props.columns.map((column) => {
							return (
								<BoardColumn key={`${column.columnId}`}
											 column={column} />
							);
						})
					}
				</Group>
			</ScrollArea.Autosize>
		</DragDropProvider>
	);
}
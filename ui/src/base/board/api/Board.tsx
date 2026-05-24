import { Key, useState } from 'react';
import { BoardItem, BoardProps, BoardReorderResult } from './BoardProps.ts';
import { getItemsPerColumn } from '@/base/board/internal/getItemsPerColumn.ts';
import { BoardColumnBlock } from '@/base/board/internal/BoardColumnBlock.tsx';
import { DragAutoScroll } from '@/base/dnd/api/DragAutoScroll';
import { getBoardItemDndContext } from '@/base/board/internal/boardItemDndContext';
import { useMonitorDrop } from '@/base/dnd/api/useMonitorDrop';

function applyDrags<TItemData, TItemId extends Key, TColumnId extends Key>(
	items: BoardItem<TItemData, TItemId, TColumnId>[],
	pendingDrags: BoardReorderResult<TItemData, TItemId, TColumnId>[]
): BoardItem<TItemData, TItemId, TColumnId>[] {
	return pendingDrags.reduce((current, drag) => {
		const draggedItem = current.find(item => item.id === drag.itemId);
		if (!draggedItem) return current;

		const updatedItem = { ...draggedItem, columnId: drag.toColumnId };
		const withoutDragged = current.filter(item => item.id !== drag.itemId);

		if (drag.previousItemId !== undefined) {
			const idx = withoutDragged.findIndex(item => item.id === drag.previousItemId);
			if (idx === -1) return [...withoutDragged, updatedItem];
			return [...withoutDragged.slice(0, idx + 1), updatedItem, ...withoutDragged.slice(idx + 1)];
		} else if (drag.nextItemId !== undefined) {
			const idx = withoutDragged.findIndex(item => item.id === drag.nextItemId);
			if (idx === -1) return [...withoutDragged, updatedItem];
			return [...withoutDragged.slice(0, idx), updatedItem, ...withoutDragged.slice(idx)];
		} else {
			const lastInColumn = withoutDragged.reduce<number>((last, item, i) =>
				item.columnId === drag.toColumnId ? i : last, -1);
			if (lastInColumn === -1) return [...withoutDragged, updatedItem];
			return [...withoutDragged.slice(0, lastInColumn + 1), updatedItem, ...withoutDragged.slice(lastInColumn + 1)];
		}
	}, items);
}

export function Board<TItemData, TItemId extends Key, TColumnId extends Key>({
																				 items,
																				 columns,
																				 renderItemCard,
																				 onReorder
																			 }: BoardProps<TItemData, TItemId, TColumnId>) {
	const [pendingDrags, setPendingDrags] = useState<BoardReorderResult<TItemData, TItemId, TColumnId>[]>([]);
	const optimisticItems = applyDrags(items, pendingDrags);
	const itemsPerColumn = getItemsPerColumn(optimisticItems, columns);

	useMonitorDrop(getBoardItemDndContext<TItemData, TItemId, TColumnId>(), (drag, drop) => {
		if(drag && drop) {
			const itemsInColumnWithoutDragged = optimisticItems
				.filter(item => item.columnId === drop.columnId)
				.filter(item => item.id !== drag.id);

			let previousItemId: TItemId | undefined;
			let nextItemId: TItemId | undefined;

			if ('after' in drop && drop.after) {
				previousItemId = drop.after;
				nextItemId = !itemsInColumnWithoutDragged.at(-1)?.id || itemsInColumnWithoutDragged.at(-1)?.id === previousItemId
					? undefined
					: itemsInColumnWithoutDragged.at(itemsInColumnWithoutDragged.findIndex(i => i.id === previousItemId) + 1)?.id;
			} else if ('before' in drop && drop.before) {
				nextItemId = drop.before;
				previousItemId = !itemsInColumnWithoutDragged.at(0)?.id || itemsInColumnWithoutDragged.at(0)?.id === nextItemId
					? undefined
					: itemsInColumnWithoutDragged.at(itemsInColumnWithoutDragged.findIndex(i => i.id === nextItemId) - 1)?.id;
			} else {
				if (itemsInColumnWithoutDragged.length > 0) {
					previousItemId = itemsInColumnWithoutDragged.at(-1)?.id;
					nextItemId = undefined;
				} else {
					previousItemId = undefined;
					nextItemId = undefined;
				}
			}

			const dragResult: BoardReorderResult<TItemData, TItemId, TColumnId> = {
				itemId: drag.id,
				itemData: drag.data,

				fromColumnId: drag.columnId,
				toColumnId: drop.columnId,

				previousItemId: previousItemId,
				nextItemId: nextItemId
			}
			setPendingDrags(prev => [...prev, dragResult]);
			Promise.resolve(onReorder?.(dragResult))
				.finally(() => setPendingDrags(prev => prev.filter(d => d !== dragResult)));
		}
	})

	return (
		<DragAutoScroll>
			<div className="flex flex-row overflow-x-auto gap-4 bg-sidebar rounded-xl p-4">
				{
					itemsPerColumn.map(column => (
						<BoardColumnBlock
							key={column.column.columnId}
							column={column.column}
							items={column.items}
							renderItemCard={renderItemCard}
						/>
					))
				}
			</div>
		</DragAutoScroll>
	);
}
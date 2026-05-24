import { createDragAndDropContext, DragAndDropContext } from '@/base/dnd/api/createDragAndDropContext.ts';
import { BoardItem } from '@/base/board/api/BoardProps';
import { Key } from 'react';

const boardItemDndContext = createDragAndDropContext<BoardItem<unknown, Key, Key>, BoardDropTargetData<Key, Key>>();
export function getBoardItemDndContext<TItemData, TItemId extends Key, TColumnId extends Key>() {
  return boardItemDndContext as unknown as DragAndDropContext<BoardItem<TItemData, TItemId, TColumnId>, BoardDropTargetData<TItemId, TColumnId>>;
}

export type BoardDropTargetData<TItemId extends Key, TColumnId extends Key> = {
	columnId: TColumnId
} & ({ before?: TItemId } | { after?: TItemId })
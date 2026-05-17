import { Key, ReactNode } from 'react';

export interface BoardProps<TItemData, TItemId extends Key, TColumnId extends Key> {
	items: BoardItem<TItemData, TItemId, TColumnId>[];
	columns: BoardColumn<TColumnId>[];
	renderItemCard: (item: TItemData, itemId: TItemId, columnId: TColumnId) => ReactNode;
	onReorder?: (result: BoardReorderResult<TItemData, TItemId, TColumnId>) => void | Promise<void>;
}

export interface BoardItem<TItemData, TItemId extends Key, TColumnId extends Key> {
	id: TItemId;
	data: TItemData;
	columnId: TColumnId;
}

export interface BoardColumn<TColumnId extends Key> {
	columnId: TColumnId;
	columnHeader: ReactNode;
	columnIcon: ReactNode;
	columnAction: ReactNode;
}

export interface BoardReorderResult<TItemData, TItemId extends Key, TColumnId extends Key> {
	itemId: TItemId;
	itemData: TItemData;

	fromColumnId: TColumnId;
	toColumnId: TColumnId;

	previousItemId?: TItemId;
	nextItemId?: TItemId;
}
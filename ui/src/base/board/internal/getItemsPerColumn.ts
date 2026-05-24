import { BoardColumn, BoardItem } from '@/base/board/api/BoardProps.ts';
import { Key } from 'react';

export function getItemsPerColumn<TItemData, TItemId extends Key, TColumnId extends Key>(
	items: BoardItem<TItemData, TItemId, TColumnId>[],
	columns: BoardColumn<TColumnId>[]
) {
	return columns.map(column => ({
		column: column,
		items: items.filter(item => item.columnId === column.columnId),
	}));
}
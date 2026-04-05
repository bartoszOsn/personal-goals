import { BoardColumnDefinition } from '@/base/board';
import { ReactNode } from 'react';

export interface BoardProps<TData, TColumnId> {
	columnWidth: number;
	columns: BoardColumnDefinition<TColumnId>[];
	items: TData[];
	itemColumnSelector: (item: TData) => TColumnId;
	itemIdSelector: (item: TData) => string;
	renderCard: (data: TData) => ReactNode;
	onItemMove: (event: BoardItemMoveEvent<TData, TColumnId>) => void | Promise<void>;
	noItemsInColumnText: string;
	onCreateItem: (columnId: TColumnId) => void | Promise<void>;
	createButtonText: string;
}

export interface BoardItemMoveEvent<TData, TColumnId> {
	item: TData;
	newColumn: BoardColumnDefinition<TColumnId>;
	newColumnItems: TData[];
	newIndexInColumn: number;
}
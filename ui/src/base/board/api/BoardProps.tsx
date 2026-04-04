import { BoardColumnDefinition } from '@/base/board';
import { ReactNode } from 'react';

export interface BoardProps<TData, TColumnId> {
	columnWidth: number;
	columns: BoardColumnDefinition<TColumnId>[];
	items: TData[];
	itemColumnSelector: (item: TData) => TColumnId;
	renderCard: (data: TData) => ReactNode;
	onColumnChange: (item: TData, newColumnId: TColumnId) => void | Promise<void>;
	noItemsInColumnText: string;
	onCreateItem: (columnId: TColumnId) => void | Promise<void>;
	createButtonText: string;
}
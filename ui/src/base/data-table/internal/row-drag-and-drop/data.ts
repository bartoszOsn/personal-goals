import { FlattenRow } from '@/base/data-table/internal/useFlattenRows.ts';
import { RowDragAndDropHitboxName } from '@/base/data-table/internal/row-drag-and-drop/hitbox.ts';

export const DRAG_DATA_SYMBOL = Symbol('DRAG_DATA_SYMBOL');
export const DROP_DATA_SYMBOL = Symbol('DROP_DATA_SYMBOL');

export interface DragData<TData, TId> {
	rowDragData: {
		[DRAG_DATA_SYMBOL]: true,
		draggedRow: FlattenRow<TData, TId>
	}
}

export function isDragData<TData, TId>(data: unknown): data is DragData<TData, TId> {
	return !!data
		&& typeof data === 'object'
		&& 'rowDragData' in data
		&& !!data.rowDragData
		&& typeof data.rowDragData === 'object'
		&& DRAG_DATA_SYMBOL in data.rowDragData;
}

export interface DropData<TData, TId> {
	rowDropData: {
		[DROP_DATA_SYMBOL]: true,
		dropTargetRow: FlattenRow<TData, TId>,
		availableHitboxes: RowDragAndDropHitboxName[],
		currentHitbox: RowDragAndDropHitboxName | null
	}
}

export function isDropData<TData, TId>(data: unknown): data is DropData<TData, TId> {
	return !!data
		&& typeof data === 'object'
		&& 'rowDropData' in data
		&& !!data.rowDropData
		&& typeof data.rowDropData === 'object'
		&& DROP_DATA_SYMBOL in data.rowDropData;
}
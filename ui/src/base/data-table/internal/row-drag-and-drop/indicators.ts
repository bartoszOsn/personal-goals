import { FlattenRow, FlattenRowsInfo } from '@/base/data-table/internal/useFlattenRows.ts';
import { getAncestors } from '@/base/data-table/internal/row-drag-and-drop/getAncestors.ts';
import { RowDragAndDropHitboxName } from '@/base/data-table/internal/row-drag-and-drop/hitbox.ts';

export function calculateParentDropIndicator<TData, TId>(flattenedRowInfo: FlattenRowsInfo<TData, TId>, dropTargetRow: FlattenRow<TData, TId>, hitbox: RowDragAndDropHitboxName): FlattenRow<TData, TId> | null {
	if (hitbox === 'middle') {
		return dropTargetRow;
	}

	if (hitbox === 'bottom' && dropTargetRow.expanded && dropTargetRow.hasChildren) {
		return dropTargetRow;
	}

	const visibleRows = flattenedRowInfo.rows.filter(r => r.visible);
	const ancestors = getAncestors(dropTargetRow, visibleRows);

	if (ancestors.length === 0) {
		return null;
	}

	return ancestors.at(-1)!;
}

export function calculateAboveDropIndicator<TData, TId>(dropTargetRow: FlattenRow<TData, TId>, hitbox: RowDragAndDropHitboxName): FlattenRow<TData, TId> | null {
	if (hitbox === 'top') {
		return dropTargetRow;
	}

	return null;
}

export function calculateBelowDropIndicator<TData, TId>(dropTargetRow: FlattenRow<TData, TId>, hitbox: RowDragAndDropHitboxName): FlattenRow<TData, TId> | null {
	if (hitbox === 'bottom') {
		return dropTargetRow;
	}

	return null;
}
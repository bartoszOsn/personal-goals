import { FlattenRow, FlattenRowsInfo } from '@/base/data-table/internal/useFlattenRows.ts';
import { DataTableRow } from '@/base/data-table/api/DataTableRow.ts';
import { createHitboxMatcher } from '@/base/pragmatic-dnd-x/crateHitboxMatcher.ts';
import { Input } from '@atlaskit/pragmatic-drag-and-drop/types';
import { getAncestors } from '@/base/data-table/internal/row-drag-and-drop/getAncestors.ts';

export type RowDragAndDropHitboxName = 'top' | 'middle' | 'bottom';

export function getAvailableHitboxes<TData, TId>(
	draggedRow: FlattenRow<TData, TId>,
	dropTargetRow: FlattenRow<TData, TId>,
	flattenedRowInfo: FlattenRowsInfo<TData, TId>,
	canBeParentPredicate: (childCandidate: DataTableRow<TData, TId>, parentCandidate: DataTableRow<TData, TId>) => boolean
): RowDragAndDropHitboxName[] {
	if (dropTargetRow.id === draggedRow.id) {
		return [];
	}

	const ancestors = getAncestors(dropTargetRow, flattenedRowInfo.rows);
	if (ancestors.some(r => r.id === draggedRow.id)) {
		return [];
	}

	const canBeParent = canBeParentPredicate(draggedRow.simpleRow, dropTargetRow.simpleRow) ?? false;
	const canBeSibling = ancestors.length === 0 || (canBeParentPredicate(draggedRow.simpleRow, ancestors.at(-1)!.simpleRow) ?? false);

	const canInsertAbove = canBeSibling;
	const canInsertInto = canBeParent;
	const canInsertBelow = (dropTargetRow.hasChildren && dropTargetRow.expanded) ? canBeParent : canBeSibling;

	return [canInsertAbove ? 'top' : undefined, canInsertInto ? 'middle' : undefined, canInsertBelow ? 'bottom' : undefined]
		.filter((hb): hb is RowDragAndDropHitboxName => hb !== undefined)
}

export function getCurrentHitbox(
	hitboxes: RowDragAndDropHitboxName[],
	element: Element,
	input: Input
): RowDragAndDropHitboxName | null {
	const matchHitbox = createHitboxMatcher({
		top: hitboxes.includes('top') ? {
			top: 0,
			bottom: { percent: hitboxes.includes('middle') ? 75 : 50 },
			left: 0,
			right: 0,
		} : undefined,
		middle: hitboxes.includes('middle') ? {
			top: { percent: hitboxes.includes('top') ? 25 : 0 },
			bottom: { percent: hitboxes.includes('bottom') ? 25 : 100 },
			left: 0,
			right: 0,
		} : undefined,
		bottom: hitboxes.includes('bottom') ? {
			top: { percent: hitboxes.includes('middle') ? 75 : 50 },
			bottom: { percent: 0 },
			left: 0,
			right: 0,
		} : undefined,
	});

	return matchHitbox(element, input);
}


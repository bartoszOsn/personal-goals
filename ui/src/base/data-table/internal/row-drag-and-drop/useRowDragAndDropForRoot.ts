import { DataTableRowMoveEventPayload, DataTableRowMoveProps } from '@/base/data-table';
import { useEffect, useState } from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { isDragData, isDropData } from '@/base/data-table/internal/row-drag-and-drop/data.ts';
import { FlattenRowsInfo } from '@/base/data-table/internal/useFlattenRows.ts';
import {
	calculateAboveDropIndicator,
	calculateBelowDropIndicator,
	calculateParentDropIndicator
} from '@/base/data-table/internal/row-drag-and-drop/indicators.ts';

export function useRowDragAndDropForRoot<TData, TId>(
	flattenedRowInfo: FlattenRowsInfo<TData, TId>,
	rowMoveProps?: DataTableRowMoveProps<TData, TId>
) {
	const [isMovePending, setIsMovePending] = useState(false);

	useEffect(() => {
		return monitorForElements({
			onDrop: (e) => {
				const dragData = e.source.data;
				const dropTargetData = e.location.current.dropTargets.at(-1)?.data;

				if (!isDragData<TData, TId>(dragData) || ! isDropData<TData, TId>(dropTargetData)) {
					return;
				}
				
				if (!dropTargetData.rowDropData.currentHitbox) {
					return;
				}

				const visibleRows = flattenedRowInfo.rows.filter(r => r.visible);
				const newParent = calculateParentDropIndicator(flattenedRowInfo, dropTargetData.rowDropData.dropTargetRow, dropTargetData.rowDropData.currentHitbox);
				const aboveDropIndicator = calculateAboveDropIndicator(dropTargetData.rowDropData.dropTargetRow, dropTargetData.rowDropData.currentHitbox);
				const belowDropIndicator = calculateBelowDropIndicator(dropTargetData.rowDropData.dropTargetRow, dropTargetData.rowDropData.currentHitbox);

				const allChildrenIdsInNewParent = newParent
					? newParent.simpleRow.children.map(c => c.id)
					: visibleRows.filter(r => r.level === 0).map(r => r.id);

				const result = allChildrenIdsInNewParent.filter(id => id !== dragData.rowDragData.draggedRow.id);

				if (aboveDropIndicator) {
					const targetIndex = result.findIndex(id => id === aboveDropIndicator.id);
					if (targetIndex !== -1) {
						result.splice(targetIndex, 0, dragData.rowDragData.draggedRow.id);
					} else {
						result.unshift(dragData.rowDragData.draggedRow.id);
					}
				} else if (belowDropIndicator) {
					const targetIndex = result.findIndex(id => id === belowDropIndicator.id);
					if (targetIndex !== -1) {
						result.splice(targetIndex + 1, 0, dragData.rowDragData.draggedRow.id);
					} else {
						result.unshift(dragData.rowDragData.draggedRow.id);
					}
				} else if (newParent) {
					result.push(dragData.rowDragData.draggedRow.id);
				} else {
					return null;
				}

				const movePayload: DataTableRowMoveEventPayload<TData, TId> = {
					movedRow: dragData.rowDragData.draggedRow.simpleRow,
					newParent: newParent ? newParent.simpleRow : null,
					newOrderInParent: result,
				};
				
				setIsMovePending(true);
				Promise.resolve(rowMoveProps?.onMove(movePayload))
					.then(() => setIsMovePending(false));
			}
		})
	}, [flattenedRowInfo, rowMoveProps]);

	return { isMovePending };
}
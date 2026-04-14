import { FlattenRow, FlattenRowsInfo } from '@/base/data-table/internal/useFlattenRows.ts';
import { DataTableRowMoveProps } from '@/base/data-table';
import { RefObject, useEffect, useState } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable, dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { getAvailableHitboxes, getCurrentHitbox } from '@/base/data-table/internal/row-drag-and-drop/hitbox.ts';
import {
	calculateAboveDropIndicator,
	calculateBelowDropIndicator,
	calculateParentDropIndicator
} from '@/base/data-table/internal/row-drag-and-drop/indicators.ts';
import { DRAG_DATA_SYMBOL, DragData, DROP_DATA_SYMBOL, DropData, isDragData, isDropData } from '@/base/data-table/internal/row-drag-and-drop/data';

export interface RowDragAndDropProps<TData, TId> {
	elementRef: RefObject<HTMLTableRowElement | null>,
	handleRef: RefObject<HTMLButtonElement | null>,
	flattenedRowInfo: FlattenRowsInfo<TData, TId>;
	currentRow: FlattenRow<TData, TId>,
	rowMoveProps?: DataTableRowMoveProps<TData, TId>;
}

export function useRowDragAndDropForRow<TData, TId>({
	elementRef,
	handleRef,
	flattenedRowInfo,
	currentRow,
	rowMoveProps
}: RowDragAndDropProps<TData, TId>) {
	const [isParentDropTarget, setIsParentDropTarget] = useState(false);
	const [isAboveDropTarget, setIsAboveDropTarget] = useState(false);
	const [isBelowDropTarget, setIsBelowDropTarget] = useState(false);
	const [isDimmed, setIsDimmed] = useState(false);
	
	useEffect(() => {
		if (!elementRef.current) return;
		if (!handleRef.current) return;
		if (!rowMoveProps) return;

		return combine(
			draggable({
				element: elementRef.current,
				dragHandle: handleRef.current,
				getInitialData: () => ({
					rowDragData: {
						[DRAG_DATA_SYMBOL]: true,
						draggedRow: currentRow
					}
				} satisfies DragData<TData, TId>)
			}),
			dropTargetForElements({
				element: elementRef.current,
				getData: (e) => {
					const dragData = e.source.data;
					if (!elementRef.current) {
						return {};
					}

					if (!isDragData<TData, TId>(dragData)) {
						return {};
					}

					const availableHitboxes = getAvailableHitboxes(
						dragData.rowDragData.draggedRow,
						currentRow,
						flattenedRowInfo,
						rowMoveProps.canBeParent
					);

					return ({
						rowDropData: {
							[DROP_DATA_SYMBOL]: true,
							dropTargetRow: currentRow,
							availableHitboxes,
							currentHitbox: getCurrentHitbox(availableHitboxes, elementRef.current, e.input)
						}
					} satisfies DropData<TData, TId>);
				},
				canDrop: (e) => {
					if (!isDragData<TData, TId>(e.source.data)) {
						return false;
					}

					const availableHitboxes = getAvailableHitboxes(
						e.source.data.rowDragData.draggedRow,
						currentRow,
						flattenedRowInfo,
						rowMoveProps.canBeParent
					);

					return availableHitboxes.length > 0;
				}
			}),
			monitorForElements({
				onDragStart: (e) => {
					const dragData = e.source.data;

					if (!isDragData<TData, TId>(dragData)) {
						return;
					}

					const availableHitboxes = getAvailableHitboxes(
						dragData.rowDragData.draggedRow,
						currentRow,
						flattenedRowInfo,
						rowMoveProps.canBeParent
					);

					setIsDimmed(availableHitboxes.length === 0);
				},
				onDrag: (e) => {
					const dragData = e.source.data;
					const dropTargetData = e.location.current.dropTargets.at(-1)?.data;

					if (!isDragData<TData, TId>(dragData) || ! isDropData<TData, TId>(dropTargetData)) {
						return;
					}

					if (!dropTargetData.rowDropData.currentHitbox) {
						return;
					}

					const parentIndicator = calculateParentDropIndicator(
						flattenedRowInfo,
						dropTargetData.rowDropData.dropTargetRow,
						dropTargetData.rowDropData.currentHitbox
					);

					const aboveIndicator = calculateAboveDropIndicator(
						dropTargetData.rowDropData.dropTargetRow,
						dropTargetData.rowDropData.currentHitbox
					);

					const belowIndicator = calculateBelowDropIndicator(
						dropTargetData.rowDropData.dropTargetRow,
						dropTargetData.rowDropData.currentHitbox
					);

					const availableHitboxes = getAvailableHitboxes(
						dragData.rowDragData.draggedRow,
						currentRow,
						flattenedRowInfo,
						rowMoveProps.canBeParent
					);

					setIsParentDropTarget(parentIndicator?.id === currentRow.id);
					setIsAboveDropTarget(aboveIndicator?.id === currentRow.id);
					setIsBelowDropTarget(belowIndicator?.id === currentRow.id);
					setIsDimmed(availableHitboxes.length === 0);
				},
				onDropTargetChange: (e) => {
					if (e.location.current.dropTargets.length === 0) {
						setIsParentDropTarget(false);
						setIsAboveDropTarget(false);
						setIsBelowDropTarget(false);
					}
				},
				onDrop: () => {
					setIsDimmed(false);
					setIsParentDropTarget(false);
					setIsAboveDropTarget(false);
					setIsBelowDropTarget(false);
				}
			})
		);
	}, [currentRow, elementRef, flattenedRowInfo, handleRef, rowMoveProps])
	
	return {
		isParentDropTarget,
		isAboveDropTarget,
		isBelowDropTarget,
		isDimmed
	}
}
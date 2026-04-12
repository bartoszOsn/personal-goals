import { FlattenRow, FlattenRowsInfo } from '@/base/data-table/internal/useFlattenRows.ts';
import { DataTableRow } from '@/base/data-table/api/DataTableRow.ts';
import { DataTableRowMoveEventPayload, DataTableRowMoveProps } from '@/base/data-table';
import { useEffect, useReducer } from 'react';

export type RowDragAndDropHitboxName = 'top' | 'middle' | 'bottom';

export interface RowDragAndDropProps<TData, TId> {
	allRows: DataTableRow<TData, TId>[],
	flattenedRowInfo: FlattenRowsInfo<TData, TId>;
	rowMoveProps?: DataTableRowMoveProps<TData, TId>;
}

export interface RowDragAndDropState<TData, TId> {
	draggedRow: FlattenRow<TData, TId> | null;
	rowToAvailableHitboxesMap: ReadonlyMap<FlattenRow<TData, TId>, readonly RowDragAndDropHitboxName[]>;
	dropTarget: { row: FlattenRow<TData, TId>, hitbox: RowDragAndDropHitboxName } | null;
	parentDropIndicator: FlattenRow<TData, TId> | null,
	aboveDropIndicator: FlattenRow<TData, TId> | null,
	belowDropIndicator: FlattenRow<TData, TId> | null,
	dimmedRows: FlattenRow<TData, TId>[],
	isMoveInProgress: boolean,
	movePayload: DataTableRowMoveEventPayload<TData, TId> | null
}

export type RowDragAndDropAction<TData, TId> =
	| { type: 'dragStart', row: FlattenRow<TData, TId> }
	| { type: 'enterDropTarget', dropTargetRow: FlattenRow<TData, TId>, hitbox: RowDragAndDropHitboxName }
	| { type: 'exitDropTarget' }
	| { type: 'enterGlobalTableDropTarget' }
	| { type: 'exitGlobalTableDropTarget' }
	| { type: 'drop' }
	| { type: 'moveResolved' }

export const rowDragAndDropInitialState: RowDragAndDropState<never, never> = {
	draggedRow: null,
	rowToAvailableHitboxesMap: new Map(),
	dropTarget: null,
	parentDropIndicator: null,
	aboveDropIndicator: null,
	belowDropIndicator: null,
	dimmedRows: [],
	isMoveInProgress: false,
	movePayload: null
};

export function useRowDragAndDrop<TData, TId>(props: RowDragAndDropProps<TData, TId>) {
	const rowDragAndDropReducer = createRowDragAndDropReducer(props);

	const [state, dispatch] = useReducer(rowDragAndDropReducer, rowDragAndDropInitialState);

	useEffect(() => {
		if (state.movePayload) {
			Promise.resolve(props.rowMoveProps?.onMove(state.movePayload))
				.finally(() => dispatch({ type: 'moveResolved' }))
		}
	}, [props.rowMoveProps, state.movePayload])

	return {
		dragStart: (row: FlattenRow<TData, TId>) => {
			dispatch({ type: 'dragStart', row });
		},

		rowToAvailableHitboxesMap: state.rowToAvailableHitboxesMap,
		enterDropTarget: (dropTargetRow: FlattenRow<TData, TId>, hitbox: RowDragAndDropHitboxName) => {
			dispatch({ type: 'enterDropTarget', dropTargetRow, hitbox });
		},
		exitDropTarget: () => {
			dispatch({ type: 'exitDropTarget' });
		},
		enterGlobalTableDropTarget: () => {
			dispatch({ type: 'enterGlobalTableDropTarget' });
		},
		exitGlobalTableDropTarget: () => {
			dispatch({ type: 'exitGlobalTableDropTarget' });
		},
		parentDropIndicator: state.parentDropIndicator,
		aboveDropIndicator: state.aboveDropIndicator,
		belowDropIndicator: state.belowDropIndicator,
		dimmedRows: state.dimmedRows,

		drop: () => {
			dispatch({ type: 'drop' });
		},
		isMoveInProgress: state.isMoveInProgress
	};
}

export const createRowDragAndDropReducer = <TData, TId>(props: RowDragAndDropProps<TData, TId>) => (prev: RowDragAndDropState<TData, TId>, action: RowDragAndDropAction<TData, TId>): RowDragAndDropState<TData, TId> => {
	switch (action.type) {
		case 'dragStart': {
			const rowToAvailableHitboxesMap = calculateRowToAvailableHitboxesMap(props, action.row);
			return {
				draggedRow: action.row,
				rowToAvailableHitboxesMap: rowToAvailableHitboxesMap,
				dropTarget: null,
				parentDropIndicator: null,
				aboveDropIndicator: null,
				belowDropIndicator: null,
				dimmedRows: calculateDimmedRows(rowToAvailableHitboxesMap),
				isMoveInProgress: false,
				movePayload: null
			};
		}
		case 'enterDropTarget': {
			return {
				...prev,
				dropTarget: { row: action.dropTargetRow, hitbox: action.hitbox },
				parentDropIndicator: calculateParentDropIndicator(props, action.dropTargetRow, action.hitbox),
				aboveDropIndicator: calculateAboveDropIndicator(action.dropTargetRow, action.hitbox),
				belowDropIndicator: calculateBelowDropIndicator(action.dropTargetRow, action.hitbox),
			};
		}
		case 'exitDropTarget': {
			return {
				...prev,
				dropTarget: null,
				parentDropIndicator: null,
				aboveDropIndicator: null,
				belowDropIndicator: null,
			};
		}
		case 'enterGlobalTableDropTarget': {
			const dropTargetRow = props.flattenedRowInfo.rows.filter(r => r.visible)
				.at(-1);

			if (!dropTargetRow) {
				return prev;
			}

			return {
				...prev,
				dropTarget: { row: dropTargetRow, hitbox: 'bottom' },
				parentDropIndicator: calculateParentDropIndicator(props, dropTargetRow, 'bottom'),
				aboveDropIndicator: calculateAboveDropIndicator(dropTargetRow, 'bottom'),
				belowDropIndicator: calculateBelowDropIndicator(dropTargetRow, 'bottom'),
			};
		}
		case 'exitGlobalTableDropTarget': {
			return {
				...prev,
				dropTarget: null,
				parentDropIndicator: null,
				aboveDropIndicator: null,
				belowDropIndicator: null,
			};
		}
		case 'drop': {
			const movePayload = calculateMovePayload(props, prev);

			if (!movePayload) {
				return rowDragAndDropInitialState;
			}

			return {
				...prev,
				isMoveInProgress: true,
				movePayload: movePayload
			};
		}
		case 'moveResolved': {
			return rowDragAndDropInitialState;
		}
		default: {
			const assert: never = action;
			throw new Error(`Unknown action ${assert}`);
		}
	}
}

function calculateRowToAvailableHitboxesMap<TData, TId>(props: RowDragAndDropProps<TData, TId>, draggedRow: FlattenRow<TData, TId>): ReadonlyMap<FlattenRow<TData, TId>, readonly RowDragAndDropHitboxName[]> {
	const result = new Map<FlattenRow<TData, TId>, readonly RowDragAndDropHitboxName[]>();
	const visibleRows = props.flattenedRowInfo.rows.filter(r => r.visible);

	for (const row of visibleRows) {
		if (row.id === draggedRow.id) {
			result.set(row, []);
			continue;
		}

		const ancestors = getAncestors(row, visibleRows);
		if (ancestors.some(r => r.id === draggedRow.id)) {
			result.set(row, []);
			continue;
		}

		const canBeParent = props.rowMoveProps?.canBeParent(draggedRow.simpleRow, row.simpleRow) ?? false;
		const canBeSibling = ancestors.length === 0 || (props.rowMoveProps?.canBeParent(ancestors.at(-1)!.simpleRow, row.simpleRow) ?? false);

		const canInsertAbove = canBeSibling;
		const canInsertInto = canBeParent;
		const canInsertBelow = (row.hasChildren && row.expanded) ? canBeParent : canBeSibling;

		result.set(
			row,
			[canInsertAbove ? 'top' : undefined, canInsertInto ? 'middle' : undefined, canInsertBelow ? 'bottom' : undefined]
				.filter((hb): hb is RowDragAndDropHitboxName => hb !== undefined)
		);
	}

	return result;
}

function calculateDimmedRows<TData, TId>(rowToAvailableHitboxesMap: ReadonlyMap<FlattenRow<TData, TId>, readonly RowDragAndDropHitboxName[]>): FlattenRow<TData, TId>[] {
	return [...rowToAvailableHitboxesMap.entries()]
		.filter(([, hitboxes]) => hitboxes.length === 0)
		.map(([row]) => row)
}

function calculateParentDropIndicator<TData, TId>(props: RowDragAndDropProps<TData, TId>, dropTargetRow: FlattenRow<TData, TId>, hitbox: RowDragAndDropHitboxName): FlattenRow<TData, TId> | null {
	if (hitbox === 'middle') {
		return dropTargetRow;
	}

	if (hitbox === 'bottom' && dropTargetRow.expanded && dropTargetRow.hasChildren) {
		return dropTargetRow;
	}

	const visibleRows = props.flattenedRowInfo.rows.filter(r => r.visible);
	const ancestors = getAncestors(dropTargetRow, visibleRows);

	if (ancestors.length === 0) {
		return null;
	}

	return ancestors.at(-1)!;
}

function calculateAboveDropIndicator<TData, TId>(dropTargetRow: FlattenRow<TData, TId>, hitbox: RowDragAndDropHitboxName): FlattenRow<TData, TId> | null {
	if (hitbox === 'top') {
		return dropTargetRow;
	}

	return null;
}

function calculateBelowDropIndicator<TData, TId>(dropTargetRow: FlattenRow<TData, TId>, hitbox: RowDragAndDropHitboxName): FlattenRow<TData, TId> | null {
	if (hitbox === 'bottom') {
		return dropTargetRow;
	}

	return null;
}

function calculateMovePayload<TData, TId>(props: RowDragAndDropProps<TData, TId>, state: RowDragAndDropState<TData, TId>): DataTableRowMoveEventPayload<TData, TId> | null {
	if (!state.draggedRow) {
		return null;
	}

	const visibleRows = props.flattenedRowInfo.rows.filter(r => r.visible);
	const newParent = state.parentDropIndicator;

	const allChildrenIdsInNewParent = newParent
		? newParent.simpleRow.children.map(c => c.id)
		: visibleRows.filter(r => r.level === 0).map(r => r.id);

	const result = allChildrenIdsInNewParent.filter(id => id !== state.draggedRow!.id);

	if (state.aboveDropIndicator) {
		const targetIndex = result.findIndex(id => id === state.aboveDropIndicator!.id);
		if (targetIndex !== -1) {
			result.splice(targetIndex, 0, state.draggedRow!.id);
		} else {
			result.unshift(state.draggedRow!.id);
		}
	} else if (state.belowDropIndicator) {
		const targetIndex = result.findIndex(id => id === state.belowDropIndicator!.id);
		if (targetIndex !== -1) {
			result.splice(targetIndex + 1, 0, state.draggedRow!.id);
		} else {
			result.unshift(state.draggedRow!.id);
		}
	} else if (newParent) {
		result.push(state.draggedRow!.id);
	} else {
		return null;
	}

	return {
		movedRow: state.draggedRow.simpleRow,
		newParent: newParent ? newParent.simpleRow : null,
		newOrderInParent: result,
	};

}

function getAncestors<TData, TId>(target: FlattenRow<TData, TId>, allRows: FlattenRow<TData, TId>[]): FlattenRow<TData, TId>[] {
	if (target.level === 0) {
		return [];
	}

	const targetIndex = allRows.indexOf(target);
	if (targetIndex === -1) {
		return [];
	}

	for (let i = targetIndex - 1; i >= 0; i--) {
		if (allRows[i].level === target.level - 1) {
			return [...getAncestors(allRows[i], allRows), allRows[i]];
		}
	}

	return [];
}

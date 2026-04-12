import { describe, expect, test } from 'vitest'
import { createRowDragAndDropReducer, rowDragAndDropInitialState, RowDragAndDropProps } from '@/base/data-table/internal/useRowDragAndDrop.ts';
import { DataTableRow } from '@/base/data-table/api/DataTableRow.ts';
import { FlattenRow, FlattenRowsInfo } from '@/base/data-table/internal/useFlattenRows.ts';

describe('row drag and drop', () => {
	const rowA1: DataTableRow<string, string> = { id: 'A.1', data: 'A.1', children: [] };
	const rowA: DataTableRow<string, string> = { id: 'A', data: 'A', children: [rowA1] };
	const rowB: DataTableRow<string, string> = { id: 'B', data: 'B', children: [] };

	const flattenedRows: FlattenRow<string, string>[] = [
		{ id: 'A', data: 'A', level: 0, hasChildren: true, expanded: true, visible: true, simpleRow: rowA },
		{ id: 'A.1', data: 'A.1', level: 1, hasChildren: false, expanded: false, visible: true, simpleRow: rowA1 },
		{ id: 'B', data: 'B', level: 0, hasChildren: false, expanded: false, visible: true, simpleRow: rowB }
	];

	const flattenedRowInfo: FlattenRowsInfo<string, string> = {
		maxLevels: 1,
		rows: flattenedRows
	};

	const rowMoveProps = {
		onMove: () => {},
		canBeParent: (_child: DataTableRow<string, string>, parent: DataTableRow<string, string>) => {
			// Row A can be parent of B, but B cannot be parent of A.
			if (parent.id === 'A') return true;
			return false;
		}
	};

	const props: RowDragAndDropProps<string, string> = {
		flattenedRowInfo,
		rowMoveProps
	};

	test('initial state is correct', () => {
		expect(rowDragAndDropInitialState.draggedRow).toBeNull();
		expect(rowDragAndDropInitialState.isMoveInProgress).toBe(false);
	});

	test('dragStart sets draggedRow and calculates hitboxes', () => {
		// given
		const reducer = createRowDragAndDropReducer(props);
		const rowToDrag = flattenedRows[2]; // Row B

		// when
		const state = reducer(rowDragAndDropInitialState, { type: 'dragStart', row: rowToDrag });

		// then
		expect(state.draggedRow).toBe(rowToDrag);
		expect(state.rowToAvailableHitboxesMap.has(flattenedRows[0])).toBe(true);
		expect(state.rowToAvailableHitboxesMap.has(flattenedRows[1])).toBe(true);
		expect(state.rowToAvailableHitboxesMap.get(rowToDrag)).toEqual([]);

		// Row A can be parent of B, so 'into' (or 'middle') should be available.
		// Wait, let's see what the code actually returns.
		const hitboxesA = state.rowToAvailableHitboxesMap.get(flattenedRows[0]);
		// canInsertAbove = canBeSibling = true (ancestors.length === 0)
		// canInsertInto = canBeParent = true (canBeParent(B, A) is true)
		// canInsertBelow = (row.hasChildren && row.expanded) ? canBeParent : canBeSibling = canBeParent = true
		// Result: ['top', 'middle', 'bottom']
		expect(hitboxesA).toContain('top');
		expect(hitboxesA).toContain('middle');
		expect(hitboxesA).toContain('bottom');
	});

	test('dragStart calculates dimmedRows correctly', () => {
		// given
		const reducer = createRowDragAndDropReducer(props);
		const rowToDrag = flattenedRows[0]; // Row A (has child A.1)

		// when
		const state = reducer(rowDragAndDropInitialState, { type: 'dragStart', row: rowToDrag });

		// then
		expect(state.dimmedRows).toHaveLength(2);
		expect(state.dimmedRows).toContain(flattenedRows[0]); // A itself
		expect(state.dimmedRows).toContain(flattenedRows[1]); // A.1 (descendant)
		expect(state.dimmedRows).not.toContain(flattenedRows[2]); // B
	});

	test('enterDropTarget sets dropTarget and indicators', () => {
		// given
		const reducer = createRowDragAndDropReducer(props);
		const rowToDrag = flattenedRows[2]; // Row B
		let state = reducer(rowDragAndDropInitialState, { type: 'dragStart', row: rowToDrag });

		// when
		state = reducer(state, { type: 'enterDropTarget', dropTargetRow: flattenedRows[0], hitbox: 'top' });

		// then
		expect(state.dropTarget?.row).toBe(flattenedRows[0]);
		expect(state.dropTarget?.hitbox).toBe('top');
		expect(state.aboveDropIndicator).toBe(flattenedRows[0]);
		expect(state.parentDropIndicator).toBeNull();
	});

	test('exitDropTarget clears dropTarget and indicators', () => {
		// given
		const reducer = createRowDragAndDropReducer(props);
		const rowToDrag = flattenedRows[2]; // Row B
		let state = reducer(rowDragAndDropInitialState, { type: 'dragStart', row: rowToDrag });
		state = reducer(state, { type: 'enterDropTarget', dropTargetRow: flattenedRows[0], hitbox: 'top' });

		// when
		state = reducer(state, { type: 'exitDropTarget' });

		// then
		expect(state.dropTarget).toBeNull();
		expect(state.aboveDropIndicator).toBeNull();
		expect(state.belowDropIndicator).toBeNull();
		expect(state.parentDropIndicator).toBeNull();
	});

	test('enterGlobalTableDropTarget targets last visible row with bottom hitbox', () => {
		// given
		const reducer = createRowDragAndDropReducer(props);
		const rowToDrag = flattenedRows[0]; // Row A
		let state = reducer(rowDragAndDropInitialState, { type: 'dragStart', row: rowToDrag });

		// when
		state = reducer(state, { type: 'enterGlobalTableDropTarget' });

		// then
		expect(state.dropTarget?.row).toBe(flattenedRows[2]); // Row B
		expect(state.dropTarget?.hitbox).toBe('bottom');
		expect(state.belowDropIndicator).toBe(flattenedRows[2]);
	});

	test('drop sets isMoveInProgress and calculates movePayload', () => {
		// given
		const reducer = createRowDragAndDropReducer(props);
		const rowToDrag = flattenedRows[2]; // Row B
		let state = reducer(rowDragAndDropInitialState, { type: 'dragStart', row: rowToDrag });
		state = reducer(state, { type: 'enterDropTarget', dropTargetRow: flattenedRows[0], hitbox: 'top' });

		// when
		state = reducer(state, { type: 'drop' });

		// then
		expect(state.isMoveInProgress).toBe(true);
		expect(state.movePayload).not.toBeNull();
		expect(state.movePayload?.movedRow.id).toBe('B');
		expect(state.movePayload?.newParent).toBeNull();
		// Row B was moved above Row A. Original root rows: [A, B]. New: [B, A].
		expect(state.movePayload?.newOrderInParent).toEqual(['B', 'A']);
	});

	test('drop into a parent calculates movePayload correctly', () => {
		// given
		const reducer = createRowDragAndDropReducer(props);
		const rowToDrag = flattenedRows[2]; // Row B
		let state = reducer(rowDragAndDropInitialState, { type: 'dragStart', row: rowToDrag });
		// Drop into Row A
		state = reducer(state, { type: 'enterDropTarget', dropTargetRow: flattenedRows[0], hitbox: 'middle' });

		// when
		state = reducer(state, { type: 'drop' });

		// then
		expect(state.isMoveInProgress).toBe(true);
		expect(state.movePayload?.newParent?.id).toBe('A');
		// Row A's children: [A.1]. After drop: [A.1, B].
		expect(state.movePayload?.newOrderInParent).toEqual(['A.1', 'B']);
	});

	test('moveResolved resets state', () => {
		// given
		const reducer = createRowDragAndDropReducer(props);
		let state = reducer(rowDragAndDropInitialState, { type: 'dragStart', row: flattenedRows[0] });
		state = { ...state, isMoveInProgress: true };

		// when
		state = reducer(state, { type: 'moveResolved' });

		// then
		expect(state).toEqual(rowDragAndDropInitialState);
	});
});

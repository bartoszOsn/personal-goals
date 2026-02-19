import { describe, expect, test } from 'vitest'
import { createRowSelectionReducer, rowSelectionReducerInitialState } from '@/base/data-table/internal/useRowSelection.ts';

describe('row selection', () => {
	const rows: string[] = [
		'row 0',
		'row 1',
		'row 2',
		'row 3',
		'row 4',
		'row 5',
		'row 6',
		'row 7',
		'row 8',
		'row 9'
	];

	test('none rows should be selected initially', () => {
		// then
		expect(rowSelectionReducerInitialState.selectedRows).toHaveLength(0);
	});

	test('click when no rows selected selects single row', () => {
		// given
		const rowToClick = rows[3];
		const reducer = createRowSelectionReducer(rows);

		// when
		const state = reducer(
			rowSelectionReducerInitialState,
			{ type: 'clickedOn', rowId: rowToClick, withShift: false}
		);

		// then
		expect(state.selectedRows).toHaveLength(1);
		expect(state.selectedRows).toContain(rowToClick);
	});

	test('click when selected selects only clicked', () => {
		// given
		const initiallySelected = 3;
		const newSelect = 5;
		const reducer = createRowSelectionReducer(rows);

		// when
		let state = reducer(
			rowSelectionReducerInitialState,
			{ type: 'clickedOn', rowId: rows[initiallySelected], withShift: false}
		);
		state = reducer(
			state,
			{ type: 'clickedOn', rowId: rows[newSelect], withShift: false}
		);

		// then
		expect(state.selectedRows).toHaveLength(1);
		expect(state.selectedRows).toContain(rows[newSelect]);
	});

	test("If first click is with shift, select from the top till the click", () => {
		// given
		const rowIndexToClick = 3;
		const reducer = createRowSelectionReducer(rows);

		// when
		const state = reducer(
			rowSelectionReducerInitialState,
			{ type: 'clickedOn', rowId: rows[rowIndexToClick], withShift: true }
		);

		// then
		expect(state.selectedRows).toHaveLength(4);
		expect(state.selectedRows).toContain(rows[0]);
		expect(state.selectedRows).toContain(rows[1]);
		expect(state.selectedRows).toContain(rows[2]);
		expect(state.selectedRows).toContain(rows[3]);
	});

	test("When two first clicks are both with shift, second click should also select from the top till the click", () => {
		// given
		const A = 3;
		const B = 5;
		const reducer = createRowSelectionReducer(rows);

		// when
		let state = reducer(
			rowSelectionReducerInitialState,
			{ type: 'clickedOn', rowId: rows[A], withShift: true }
		);
		state = reducer(
			state,
			{ type: 'clickedOn', rowId: rows[B], withShift: true }
		);

		// then
		expect(state.selectedRows).toHaveLength(6);
		expect(state.selectedRows).toContain(rows[0]);
		expect(state.selectedRows).toContain(rows[1]);
		expect(state.selectedRows).toContain(rows[2]);
		expect(state.selectedRows).toContain(rows[3]);
		expect(state.selectedRows).toContain(rows[4]);
		expect(state.selectedRows).toContain(rows[5]);
	});

	test('click A, then click B with shift: select from A to B', () => {
		// given
		const A = 3;
		const B = 6;
		const reducer = createRowSelectionReducer(rows);

		// when
		let state = reducer(
			rowSelectionReducerInitialState,
			{ type: 'clickedOn', rowId: rows[A], withShift: false }
		);
		state = reducer(
			state,
			{ type: 'clickedOn', rowId: rows[B], withShift: true }
		);

		// then
		expect(state.selectedRows).toHaveLength(4);
		expect(state.selectedRows).toContain(rows[3]);
		expect(state.selectedRows).toContain(rows[4]);
		expect(state.selectedRows).toContain(rows[5]);
		expect(state.selectedRows).toContain(rows[6]);
	});

	test('click B, then click A with shift: select from A to B', () => {
		// given
		const B = 6;
		const A = 3;
		const reducer = createRowSelectionReducer(rows);

		// when
		let state = reducer(
			rowSelectionReducerInitialState,
			{ type: 'clickedOn', rowId: rows[B], withShift: false }
		);
		state = reducer(
			state,
			{ type: 'clickedOn', rowId: rows[A], withShift: true }
		);

		// then
		expect(state.selectedRows).toHaveLength(4);
		expect(state.selectedRows).toContain(rows[3]);
		expect(state.selectedRows).toContain(rows[4]);
		expect(state.selectedRows).toContain(rows[5]);
		expect(state.selectedRows).toContain(rows[6]);
	});

	test('click outside deselects all', () => {
		// given
		const reducer = createRowSelectionReducer(rows);

		// when
		let state = reducer(
			rowSelectionReducerInitialState,
			{ type: 'clickedOn', rowId: rows[3], withShift: true }
		);
		state = reducer(
			state,
			{ type: 'clickOutside' }
		);

		// then
		expect(state.selectedRows).toHaveLength(0);
	});

	test('shift after deselection still selects from the lastly selected element', () => {
		// given
		const A = 3;
		const B = 5;
		const C = 7;
		const reducer = createRowSelectionReducer(rows);

		// when
		let state = reducer(
			rowSelectionReducerInitialState,
			{ type: 'clickedOn', rowId: rows[A], withShift: false }
		);
		state = reducer(
			state,
			{ type: 'clickedOn', rowId: rows[B], withShift: true }
		);
		state = reducer(
			state,
			{ type: 'clickOutside' }
		);
		state = reducer(
			state,
			{ type: 'clickedOn', rowId: rows[C], withShift: true }
		)

		// then
		expect(state.selectedRows).toHaveLength(5);
		expect(state.selectedRows).toContain(rows[3]);
		expect(state.selectedRows).toContain(rows[4]);
		expect(state.selectedRows).toContain(rows[5]);
		expect(state.selectedRows).toContain(rows[6]);
		expect(state.selectedRows).toContain(rows[7]);
	});
});
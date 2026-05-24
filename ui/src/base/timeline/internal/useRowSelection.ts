import { useReducer } from 'react';

export interface RowSelectionState<TId> {
	lastSingleSelect: TId | null;
	selectedRows: TId[];
}

export type RowSelectionAction<TId> =
	| { type: 'clickedOn', rowId: TId, withShift: boolean }
	| { type: 'clickOutside' };

export function useRowSelection<TId>(allRowIds: TId[], onSelectionChange?: (selectedRows: TId[]) => void) {
	const rowSelectionReducer = createRowSelectionReducer(allRowIds, onSelectionChange);

	const [state, dispatch] = useReducer(
		rowSelectionReducer,
		rowSelectionReducerInitialState
	);

	return {
		selectedRows: state.selectedRows,
		clickedOn: (rowId: TId, withShift: boolean) => {
			dispatch({ type: 'clickedOn', rowId, withShift });
		},
		clickOutside: () => {
			dispatch({ type: 'clickOutside' });
		}
	};
}

export const rowSelectionReducerInitialState: RowSelectionState<never> = {
	lastSingleSelect: null,
	selectedRows: []
};

export const createRowSelectionReducer = <TId>(allRowIds: TId[], onSelectionChange?: (selectedRows: TId[]) => void) => (prevState: RowSelectionState<TId>, action: RowSelectionAction<TId>): RowSelectionState<TId> => {
	const lastSingleSelect = prevState.lastSingleSelect !== null && allRowIds.includes(prevState.lastSingleSelect)
		? prevState.lastSingleSelect
		: null

	switch (action.type) {
		case 'clickOutside': {
			const newSelectedRows: TId[] = [];
			onSelectionChange?.(newSelectedRows);
			return {
				lastSingleSelect: lastSingleSelect,
				selectedRows: newSelectedRows
			}
		}
		case 'clickedOn': {
			if (!action.withShift) {
				const newSelectedRows: TId[] = [action.rowId];
				onSelectionChange?.(newSelectedRows);
				return {
					lastSingleSelect: action.rowId,
					selectedRows: newSelectedRows
				}
			} else {
				const from = prevState.lastSingleSelect !== null ? prevState.lastSingleSelect : null
				const to = action.rowId;
				let fromIndex = from !== null ? allRowIds.indexOf(from) : 0;
				const toIndex = allRowIds.indexOf(to);

				if (fromIndex === -1) {
					fromIndex = 0;
				}

				if (toIndex === -1) {
					return prevState;
				}

				const newSelectedRows = allRowIds.slice(Math.min(fromIndex, toIndex), Math.max(fromIndex, toIndex) + 1);
				onSelectionChange?.(newSelectedRows);
				return {
					lastSingleSelect: prevState.lastSingleSelect,
					selectedRows: newSelectedRows
				}
			}
		}
	}
};

import { useCallback, useMemo, useReducer } from 'react';

export interface RowSelectionState {
	lastSingleSelect: string | null;
	selectedRows: string[];
}

export type RowSelectionAction =
	| { type: 'clickedOn', rowId: string, withShift: boolean }
	| { type: 'clickOutside' };

export function useRowSelection(allRowIds: string[]) {
	const rowSelectionReducer = useMemo(
		() => createRowSelectionReducer(allRowIds),
		[allRowIds]
	);

	const [state, dispatch] = useReducer(
		rowSelectionReducer,
		rowSelectionReducerInitialState
	);

	return {
		selectedRows: state.selectedRows,
		clickedOn: useCallback(
			(rowId: string, withShift: boolean) => {
				dispatch({ type: 'clickedOn', rowId, withShift });
			},
			[dispatch]
		),
		clickOutside: useCallback(
			() => {
				dispatch({ type: 'clickOutside' });
			},
			[dispatch]
		)
	};
}

export const rowSelectionReducerInitialState: RowSelectionState = {
	lastSingleSelect: null,
	selectedRows: []
};

export const createRowSelectionReducer = (allRowIds: string[]) => (prevState: RowSelectionState, action: RowSelectionAction): RowSelectionState => {
	const lastSingleSelect = prevState.lastSingleSelect !== null && allRowIds.includes(prevState.lastSingleSelect)
		? prevState.lastSingleSelect
		: null

	switch (action.type) {
		case 'clickOutside': {
			return {
				lastSingleSelect: lastSingleSelect,
				selectedRows: []
			}
		}
		case 'clickedOn': {
			if (!action.withShift) {
				return {
					lastSingleSelect: action.rowId,
					selectedRows: [action.rowId]
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
				return {
					lastSingleSelect: prevState.lastSingleSelect,
					selectedRows: newSelectedRows
				}
			}
		}
	}
};

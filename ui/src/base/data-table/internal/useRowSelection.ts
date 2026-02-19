import { useCallback, useMemo, useReducer } from 'react';

export interface RowSelectionState<TId> {
	lastSingleSelect: TId | null;
	selectedRows: TId[];
}

export type RowSelectionAction<TId> =
	| { type: 'clickedOn', rowId: TId, withShift: boolean }
	| { type: 'clickOutside' };

export function useRowSelection<TId>(allRowIds: TId[]) {
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
			(rowId: TId, withShift: boolean) => {
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

export const rowSelectionReducerInitialState: RowSelectionState<never> = {
	lastSingleSelect: null,
	selectedRows: []
};

export const createRowSelectionReducer = <TId>(allRowIds: TId[]) => (prevState: RowSelectionState<TId>, action: RowSelectionAction<TId>): RowSelectionState<TId> => {
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

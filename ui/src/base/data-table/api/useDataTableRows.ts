import { DataTableRow } from '@/base/data-table/api/DataTableRow.ts';
import { useMemo } from 'react';

export interface UseDataTableRowsProps<TData, TId> {
	rawData: TData[];
	/**
	 * Must be non-reactive, static, pure function for performance reason.
	 */
	getId: (data: TData) => TId;
	/**
	 * Must be non-reactive, static, pure function for performance reason.
	 */
	getChildren: (data: TData) => TData[];
}

export function useDataTableRows<TData, TId>({ rawData, getId, getChildren }: UseDataTableRowsProps<TData, TId>): DataTableRow<TData, TId>[] {
	return useMemo(() => {
		function toDataTableRow(data: TData): DataTableRow<TData, TId> {
			return {
				id: getId(data),
				data: data,
				children: getChildren(data).map(toDataTableRow)
			};
		}

		return rawData.map(toDataTableRow);
	}, [rawData])
}
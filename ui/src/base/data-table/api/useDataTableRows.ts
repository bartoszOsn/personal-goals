import { DataTableRow } from '@/base/data-table/api/DataTableRow.ts';
import { MantineColor } from '@mantine/core';

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
	/**
	 * Must be non-reactive, static, pure function for performance reason.
	 */
	getColor?: (data: TData) => MantineColor | undefined;
}

export function useDataTableRows<TData, TId>({ rawData, getId, getChildren, getColor }: UseDataTableRowsProps<TData, TId>): DataTableRow<TData, TId>[] {
	function toDataTableRow(data: TData): DataTableRow<TData, TId> {
		return {
			id: getId(data),
			data: data,
			children: getChildren(data).map(toDataTableRow),
			backgroundColor: getColor?.(data),
		};
	}

	return rawData.map(toDataTableRow);
}
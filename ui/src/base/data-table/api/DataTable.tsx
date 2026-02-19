import type { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor.tsx';
import type { PropertyStorage } from '@/base/property-storage/propertyStorage.ts';
import { localStoragePropertyStorage } from '@/base/property-storage/localStoragePropertyStorage.ts';
import { useMemo } from 'react';
import { Table, type TableProps, type TableScrollContainerProps } from '@mantine/core';
import { DataTableBody } from '@/base/data-table/internal/DataTableBody.tsx';
import { DataTableHeader } from '@/base/data-table/internal/DataTableHeader.tsx';

export interface DataTable<TData, TId> {
	rows: TData[];
	idSelector: (row: TData) => TId;
	possibleColumns: ColumnDescriptor<TData, unknown>[];
	initialColumnIds: string[];
	storage?: PropertyStorage;
	tableProps?: TableProps;
	scrollContainerProps?: TableScrollContainerProps;
}

export function DataTable<TData, TId>(props: DataTable<TData, TId>) {
	const {
		rows,
		idSelector,
		possibleColumns,
		initialColumnIds,
		storage = localStoragePropertyStorage,
		tableProps = {},
		scrollContainerProps = {},
	} = props;

	const currentColumns = useMemo(() => {
		return possibleColumns.filter(column => initialColumnIds.includes(column.columnId));
	}, [possibleColumns, initialColumnIds]);

	return (
		<Table.ScrollContainer minWidth={300} {...scrollContainerProps}>
			<Table {...tableProps}>
				<DataTableHeader columns={currentColumns} />
				<DataTableBody columns={currentColumns} rows={rows} />
			</Table>
		</Table.ScrollContainer>
	)
}
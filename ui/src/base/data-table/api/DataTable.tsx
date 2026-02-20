import type { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor.tsx';
import type { PropertyStorage } from '@/base/property-storage/propertyStorage.ts';
import { localStoragePropertyStorage } from '@/base/property-storage/localStoragePropertyStorage.ts';
import { Table, type TableProps, type TableScrollContainerProps } from '@mantine/core';
import { DataTableBody } from '@/base/data-table/internal/DataTableBody.tsx';
import { DataTableHeader } from '@/base/data-table/internal/DataTableHeader.tsx';
import { useCurrentColumns } from '@/base/data-table/internal/useCurrentColumns';
import { DataTableSkeleton } from '@/base/data-table/internal/DataTableSkeleton';

export interface DataTable<TData, TId> {
	rows: TData[];
	idSelector: (row: TData) => TId;
	possibleColumns: ColumnDescriptor<TData, unknown>[];
	initialColumnIds: string[];
	tableKey: string
	storage?: PropertyStorage;
	tableProps?: TableProps;
	scrollContainerProps?: TableScrollContainerProps;
	onSelectionChange?: (rows: TData[]) => void;
}

export function DataTable<TData, TId>(props: DataTable<TData, TId>) {
	const {
		rows,
		idSelector,
		possibleColumns,
		initialColumnIds,
		tableKey,
		storage = localStoragePropertyStorage,
		tableProps = {},
		scrollContainerProps = { minWidth: 300},
		onSelectionChange,
	} = props;

	const { columns, loading: columnsLoading, setColumns } = useCurrentColumns({
		storage,
		initialColumnIds,
		possibleColumns,
		tableKey
	});

	if (columnsLoading) {
		return <DataTableSkeleton tableProps={tableProps} scrollContainerProps={scrollContainerProps} />
	}

	return (
		<Table.ScrollContainer {...scrollContainerProps}>
			<Table {...tableProps}>
				<DataTableHeader columns={columns} allPossibleColumns={possibleColumns} setColumns={setColumns} />
				<DataTableBody columns={columns}
							   rows={rows}
							   idSelector={idSelector}
							   onSelectionChange={(rows) => onSelectionChange?.(rows)}
				/>
			</Table>
		</Table.ScrollContainer>
	)
}
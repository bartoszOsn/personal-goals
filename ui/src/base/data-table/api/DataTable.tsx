import type { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor.tsx';
import type { PropertyStorage } from '@/base/property-storage/propertyStorage.ts';
import { localStoragePropertyStorage } from '@/base/property-storage/localStoragePropertyStorage.ts';
import { ScrollArea, type ScrollAreaAutosizeProps, Table, type TableProps } from '@mantine/core';
import { DataTableBody } from '@/base/data-table/internal/DataTableBody.tsx';
import { DataTableHeader } from '@/base/data-table/internal/DataTableHeader.tsx';
import { useCurrentColumns } from '@/base/data-table/internal/useCurrentColumns';
import { DataTableSkeleton } from '@/base/data-table/internal/DataTableSkeleton';
import { DataTableColgroup } from '@/base/data-table/internal/DataTableColgroup';
import { useElementSize } from '@mantine/hooks';

export interface DataTable<TData, TId> {
	rows: TData[];
	idSelector: (row: TData) => TId;
	possibleColumns: ColumnDescriptor<TData, unknown>[];
	initialColumnIds: string[];
	tableKey: string
	storage?: PropertyStorage;
	tableProps?: TableProps;
	scrollAreaProps?: ScrollAreaAutosizeProps;
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
		scrollAreaProps = {},
		onSelectionChange,
	} = props;

	const { ref: tableRef, width: tableWidth } = useElementSize();

	const { columns, loading: columnsLoading, setColumns } = useCurrentColumns({
		storage,
		initialColumnIds,
		possibleColumns,
		tableKey
	});

	if (columnsLoading) {
		return <DataTableSkeleton tableProps={tableProps} scrollAreaProps={scrollAreaProps} />
	}

	return (
		<ScrollArea.Autosize ref={tableRef} scrollbars={'xy'} {...scrollAreaProps}>
			<Table style={{tableLayout: 'fixed' }} {...tableProps}>
				<DataTableColgroup tableWidth={tableWidth} columns={columns} widths={new Map()} />
				<DataTableHeader columns={columns} allPossibleColumns={possibleColumns} setColumns={setColumns} />
				<DataTableBody columns={columns}
							   rows={rows}
							   idSelector={idSelector}
							   onSelectionChange={(rows) => onSelectionChange?.(rows)}
				/>
			</Table>
		</ScrollArea.Autosize>
	)
}
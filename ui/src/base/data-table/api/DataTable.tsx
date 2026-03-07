import { localStoragePropertyStorage } from '@/base/property-storage/localStoragePropertyStorage.ts';
import { ScrollArea, Table } from '@mantine/core';
import { DataTableBody } from '@/base/data-table/internal/DataTableBody.tsx';
import { DataTableHeader } from '@/base/data-table/internal/DataTableHeader.tsx';
import { useCurrentColumns } from '@/base/data-table/internal/useCurrentColumns';
import { DataTableSkeleton } from '@/base/data-table/internal/DataTableSkeleton';
import { DataTableColgroup } from '@/base/data-table/internal/DataTableColgroup';
import { useElementSize } from '@mantine/hooks';
import { useRef } from 'react';
import { useTableResizing } from '@/base/data-table/internal/useTableResizing';
import { DataTableProps } from '@/base/data-table/api/DataTableProps';
import { useFlattenRows } from '@/base/data-table/internal/useFlattenRows';

export function DataTable<TData, TId>(props: DataTableProps<TData, TId>) {
	const {
		rows,
		possibleColumns,
		initialColumnIds,
		tableKey,
		storage = localStoragePropertyStorage,
		tableProps = {},
		scrollAreaProps = {},
		onSelectionChange,
		onExpansionChange,
		renderContextMenu
	} = props;

	const { ref: scrollAreaRef, width: scrollAreaWidth } = useElementSize();
	const fallbackTableRef = useRef<HTMLTableElement>(null);
	const tableRef = props.tableRef ?? fallbackTableRef;

	const { columns, loading: columnsLoading, setColumns } = useCurrentColumns({
		storage,
		initialColumnIds,
		possibleColumns,
		tableKey
	});

	const { columnWidths, loading: widthsLoading, startDrag } = useTableResizing<TData>({
		tableRef,
		storage,
		tableKey
	});

	const {
		rowInfo,
		toggle: toggleRow
	} = useFlattenRows(rows, onExpansionChange);

	if (columnsLoading || widthsLoading) {
		return <DataTableSkeleton tableProps={tableProps} scrollAreaProps={scrollAreaProps} />;
	}

	return (
		<ScrollArea.Autosize ref={scrollAreaRef} scrollbars={'xy'} {...scrollAreaProps}>
			<Table ref={tableRef} style={{ tableLayout: 'fixed' }} {...tableProps}>
				<DataTableColgroup tableWidth={scrollAreaWidth}
								   columns={columns}
								   widths={columnWidths} />
				<DataTableHeader columns={columns}
								 allPossibleColumns={possibleColumns}
								 setColumns={setColumns}
								 onStartDrag={startDrag}
								 tableHeaderProps={props.tableHeaderProps} />
				<DataTableBody columns={columns}
							   onSelectionChange={(rows) => onSelectionChange?.(rows)}
							   rowInfo={rowInfo}
							   toggleRow={toggleRow}
							   renderContextMenu={renderContextMenu}
				/>
			</Table>
		</ScrollArea.Autosize>
	);
}
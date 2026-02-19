import type { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor.tsx';
import { Table } from '@mantine/core';
import { DataView } from '@/base/data-type';
import { useRowSelection } from '@/base/data-table/internal/useRowSelection';
import { useEffect, useMemo } from 'react';
import { useClickOutside } from '@mantine/hooks';

export interface DataTableBodyProps<TData, TId> {
	columns: ColumnDescriptor<TData, unknown>[];
	rows: TData[];
	idSelector: (row: TData) => TId;
	onSelectionChange: (rows: TData[]) => void;
}

export function DataTableBody<TData, TId>(props: DataTableBodyProps<TData, TId>) {
	const {
		columns,
		rows,
		idSelector,
		onSelectionChange
	} = props;

	const allRowIds = useMemo(() => rows.map(idSelector), [rows, idSelector]);

	const {
		selectedRows,
		clickedOn,
		clickOutside
	} = useRowSelection(allRowIds);

	useEffect(() => {
		onSelectionChange(rows.filter((row) => selectedRows.includes(idSelector(row))));
	}, [idSelector, onSelectionChange, rows, selectedRows]);

	const tBodyRef = useClickOutside(clickOutside);

	return (
		<Table.Tbody ref={tBodyRef} style={{ userSelect: 'none' }}>
			{
				rows.map((row: TData) => (
					<Table.Tr bg={selectedRows.includes(idSelector(row)) ? 'blue.0' : 'white'} onClick={(e) => clickedOn(idSelector(row), e.shiftKey)}>
						{
							columns.map((column) => (
								<Table.Td>
									<DataView value={column.select(row)}
											  onChange={(newValue) => column.onChange(row, newValue)}
											  dataType={column.columnType} />
								</Table.Td>
							))
						}
					</Table.Tr>
				))
			}
		</Table.Tbody>
	)
}
import type { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor.tsx';
import { Table } from '@mantine/core';

interface DataTableHeaderProps<TData> {
	columns: ColumnDescriptor<TData, unknown>[]
}

export function DataTableHeader<TData>(props: DataTableHeaderProps<TData>) {
	return (
		<Table.Thead>
			<Table.Tr>
				{props.columns.map((column) => (
					<Table.Th key={column.columnId}>{column.columnName}</Table.Th>
				))}
			</Table.Tr>
		</Table.Thead>
	)
}
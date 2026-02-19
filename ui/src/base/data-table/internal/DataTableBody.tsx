import type { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor.tsx';
import { Table } from '@mantine/core';
import { DataView } from '@/base/data-type';

export interface DataTableBodyProps<TData> {
	columns: ColumnDescriptor<TData, unknown>[];
	rows: TData[];
}

export function DataTableBody<TData>(props: DataTableBodyProps<TData>) {
	const {
		columns,
		rows
	} = props;

	return (
		<Table.Tbody>
			{
				rows.map((row: TData) => (
					<Table.Tr>
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
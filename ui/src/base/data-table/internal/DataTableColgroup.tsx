import { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor.tsx';

export interface DataTableColgroupProps<TData> {
	columns: ColumnDescriptor<TData, unknown>[];
	widths: Map<string, number>;
	tableWidth: number;
}

export function DataTableColgroup<TData>(props: DataTableColgroupProps<TData>) {
	return (
		<colgroup>
			{
				props.columns.map((column) => {
					const widthPx = props.widths.get(column.columnId) ?? 300;
					const widthFr = props.tableWidth / props.columns.length;

					return (
						<col key={column.columnId}
							 style={{ width: `${Math.max(widthPx, widthFr)}px` }} />
					);
				})
			}
		</colgroup>
	);
}
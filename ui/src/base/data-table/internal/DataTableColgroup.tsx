import { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor.tsx';

export interface DataTableColgroupProps<TData> {
	columns: ColumnDescriptor<TData>[];
	widths: Map<string, number>;
	tableWidth: number;
}

const ACTION_COLUMN_WIDTH = 38;

export function DataTableColgroup<TData>(props: DataTableColgroupProps<TData>) {
	return (
		<colgroup>
			{
				props.columns.map((column, i) => {
					const isLast = i === props.columns.length - 1;

					const widthPx = props.widths.get(column.columnId) ?? 300;
					const widthFr = props.tableWidth / props.columns.length;
					let actualWidth = Math.max(widthPx, widthFr);

					if (isLast) {
						actualWidth -= ACTION_COLUMN_WIDTH;
					}

					return (
						<col key={column.columnId}
							 style={{ width: `${actualWidth}px` }} />
					);
				})
			}
			<col style={{ width: `${ACTION_COLUMN_WIDTH}px` }} />
		</colgroup>
	);
}
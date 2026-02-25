import type { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor';
import type { PropertyStorage } from '@/base/property-storage/propertyStorage';
import type { ScrollAreaAutosizeProps, TableProps } from '@mantine/core';
import type { DataTableRow } from '@/base/data-table/api/DataTableRow';

export interface DataTableProps<TData, TId> {
	rows: DataTableRow<TData, TId>[];
	possibleColumns: ColumnDescriptor<TData, unknown>[];
	initialColumnIds: string[];
	tableKey: string;
	storage?: PropertyStorage;
	tableProps?: TableProps;
	scrollAreaProps?: ScrollAreaAutosizeProps;
	onSelectionChange?: (rows: TData[]) => void;
}
import type { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor';
import type { PropertyStorage } from '@/base/property-storage/propertyStorage';
import type { ScrollAreaAutosizeProps, TableProps } from '@mantine/core';

export interface DataTableProps<TData, TId> {
	rows: TData[];
	idSelector: (row: TData) => TId;
	possibleColumns: ColumnDescriptor<TData, unknown>[];
	initialColumnIds: string[];
	tableKey: string;
	storage?: PropertyStorage;
	tableProps?: TableProps;
	scrollAreaProps?: ScrollAreaAutosizeProps;
	onSelectionChange?: (rows: TData[]) => void;
}
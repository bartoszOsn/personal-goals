import type { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor';
import type { PropertyStorage } from '@/base/property-storage/propertyStorage';
import type { ScrollAreaAutosizeProps, TableProps, TableTheadProps } from '@mantine/core';
import type { DataTableRow } from '@/base/data-table/api/DataTableRow';
import type { RefObject } from 'react';

export interface DataTableProps<TData, TId> {
	rows: DataTableRow<TData, TId>[];
	possibleColumns: ColumnDescriptor<TData, unknown>[];
	initialColumnIds: string[];
	tableKey: string;
	storage?: PropertyStorage;
	tableProps?: TableProps;
	scrollAreaProps?: ScrollAreaAutosizeProps;
	tableHeaderProps?: TableTheadProps;
	onSelectionChange?: (rows: TData[]) => void;
	tableRef?: RefObject<HTMLTableElement | null>;
}
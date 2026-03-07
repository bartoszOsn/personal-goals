import { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor';
import { PropertyStorage } from '@/base/property-storage/propertyStorage';
import { ScrollAreaAutosizeProps, TableProps, TableTheadProps } from '@mantine/core';
import { DataTableRow } from '@/base/data-table/api/DataTableRow';
import { ReactNode, RefObject } from 'react';

export interface DataTableProps<TData, TId> {
	rows: DataTableRow<TData, TId>[];
	possibleColumns: ColumnDescriptor<TData>[];
	initialColumnIds: string[];
	tableKey: string;
	storage?: PropertyStorage;
	tableProps?: TableProps;
	scrollAreaProps?: ScrollAreaAutosizeProps;
	tableHeaderProps?: TableTheadProps;
	onSelectionChange?: (rows: TData[]) => void;
	onExpansionChange?: (rows: TId[]) => void;
	tableRef?: RefObject<HTMLTableElement | null>;
	renderContextMenu?: (openedOn: TData, selected: TData[]) => ReactNode;
}
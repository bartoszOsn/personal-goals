import { useCallback, useEffect, useState } from 'react';
import type { PropertyStorage } from '@/base/property-storage/propertyStorage.ts';
import type { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor.tsx';

export interface UseCurrentColumnsProps<TData> {
	storage: PropertyStorage;
	tableKey: string;
	possibleColumns: ColumnDescriptor<TData, unknown>[];
	initialColumnIds: string[];
}

export function useCurrentColumns<TData>(props: UseCurrentColumnsProps<TData>) {
	const { storage, tableKey, possibleColumns, initialColumnIds } = props;

	const storageKey = `${tableKey}-columns`;
	
	const [loading, setLoading] = useState<boolean>(true);
	const [columns, setColumns] = useState<ColumnDescriptor<TData, unknown>[]>([]);
	useEffect(() => {
		storage.getItem<string[]>(storageKey)
			.then((storedColumnIds) => {
				const columnIds = storedColumnIds ?? initialColumnIds;
				setColumns(possibleColumns.filter((column) => columnIds.includes(column.columnId)));
				setLoading(false);
			});
	}, [initialColumnIds, possibleColumns, storage, storageKey]);

	const setColumnsAndPersist = useCallback((columns: ColumnDescriptor<TData, unknown>[]) => {
		const ids = columns.map((column) => column.columnId);
		storage.setItem(storageKey, ids).then();
		setColumns(columns);
	}, [storage, storageKey]);

	return { columns, loading, setColumns: setColumnsAndPersist };
}
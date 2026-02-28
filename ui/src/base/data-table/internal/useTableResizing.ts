import { RefObject, useEffect, useMemo, useState } from 'react';
import { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor.tsx';
import { PropertyStorage } from '@/base/property-storage/propertyStorage';
import * as React from 'react';

export interface UseTableResizingProps {
	tableRef: RefObject<HTMLTableElement | null>;
	storage: PropertyStorage;
	tableKey: string;
}

export function useTableResizing<TData>(props: UseTableResizingProps) {
	const [loading, setLoading] = useState<boolean>(true);
	const [columnWidths, setColumnWidths] = useState<{ [columnId: string]: number }>({});
	const columnWidthsMap = useMemo(() => new Map(Object.entries(columnWidths)), [columnWidths]);

	const storageKey = `${props.tableKey}-column-widths`;

	const loadFromStorage = async () => {
		setLoading(true);
		const storedWidths = await props.storage.getItem<{ [columnId: string]: number }>(storageKey);
		if (storedWidths) {
			setColumnWidths(storedWidths);
		}
		setLoading(false);
	}

	const saveToStorage = async (newValue: { [columnId: string]: number }) => {
		await props.storage.setItem(storageKey, newValue);
	}

	useEffect(() => {
		loadFromStorage();
	}, []);

	return {
		loading,
		columnWidths: columnWidthsMap,
		startDrag: (column: ColumnDescriptor<TData, unknown>, e: React.MouseEvent) => {
			if (props.tableRef.current === null) {
				return;
			}
			const tableRect = props.tableRef.current.getBoundingClientRect();
			const columnElement = props.tableRef.current.querySelector<HTMLElement>(`[data-column-id="${column.columnId}"]`);
			const initialColumnWidth = columnWidths[column.columnId] ?? columnElement?.offsetWidth ?? 0;
			const dragStartX = e.clientX - tableRect.left;

			let updatedColumnWidths = columnWidths;

			const onMouseMove = (e: MouseEvent) => {
				const dragX = e.clientX - tableRect.left;
				const offsetFromStart = dragX - dragStartX;
				const newColumnWidth = initialColumnWidth + offsetFromStart;
				setColumnWidths(prev => {
					const newWidths = { ...prev, [column.columnId]: newColumnWidth };
					updatedColumnWidths = columnWidths;
					return newWidths;
				});
			}

			window.addEventListener('mousemove', onMouseMove);
			window.addEventListener('mouseup', () => {
				window.removeEventListener('mousemove', onMouseMove);
				saveToStorage(updatedColumnWidths).then();
			}, { once: true });
		}
	}
}
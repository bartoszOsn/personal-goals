import { useState } from 'react';
import { DataTableRow } from '@/base/data-table/api/DataTableRow';
import { MantineColor } from '@mantine/core';

export interface FlattenRowsInfo<TData, TId> {
	maxLevels: number;
	rows: FlattenRow<TData, TId>[];
}

export interface FlattenRow<TData, TId> {
	data: TData;
	id: TId;
	level: number;
	hasChildren: boolean;
	expanded: boolean;
	visible: boolean;
	backgroundColor?: MantineColor;
}

export function useFlattenRows<TData, TId>(rows: DataTableRow<TData, TId>[], onExpansionChange?: (rows: TId[]) => void) {
	const [expanded, setExpanded] = useState<TId[]>([]);

	const flatRows: FlattenRow<TData, TId>[] = flattenRows(rows, expanded);
	const maxLevel = Math.max(...flatRows.map(r => r.level));

	const flattenedRows: FlattenRowsInfo<TData, TId> = {
		maxLevels: maxLevel,
		rows: flatRows
	};

	return {
		rowInfo: flattenedRows,
		toggle: (id: TId) => {
			let stateAfterChange: TId[] = [];
			if (expanded.includes(id)) {
				setExpanded(prev => {
					stateAfterChange = prev.filter(i => i !== id);
					return stateAfterChange;
				});
			} else {
				setExpanded((prev) => {
					stateAfterChange = [...prev, id];
					return stateAfterChange;
				});
			}
			onExpansionChange?.(stateAfterChange);
		}
	};
}

function flattenRows<TData, TId>(
	data: DataTableRow<TData, TId>[],
	expanded: TId[],
	currentLevel: number = 0,
	visible: boolean = true
): FlattenRow<TData, TId>[] {
	const result: FlattenRow<TData, TId>[] = [];
	for (const datum of data) {
		const children = datum.children;

		const row: FlattenRow<TData, TId> = {
			data: datum.data,
			id: datum.id,
			level: currentLevel,
			hasChildren: children.length > 0,
			expanded: expanded.includes(datum.id),
			visible: visible,
			backgroundColor: datum.backgroundColor
		};

		result.push(row);
		result.push(...flattenRows(children, expanded, currentLevel + 1, row.expanded && row.visible));
	}

	return result;
}
import { useMemo, useState } from 'react';

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
}

export function useFlattenRows<TData, TId>(
	data: TData[],
	getId: (data: TData) => TId,
	getChildren: (data: TData) => TData[]
) {
	const [expanded, setExpanded] = useState<TId[]>([]);

	const flattenedRows: FlattenRowsInfo<TData, TId> = useMemo(() => {
		const rows: FlattenRow<TData, TId>[] = flattenRows(data, expanded, getId, getChildren);
		const maxLevel = Math.max(...rows.map(r => r.level));

		return {
			maxLevels: maxLevel,
			rows
		};
	}, [data, expanded, getChildren, getId]);

	return {
		rowInfo: flattenedRows,
		toggle: (id: TId) => {
			if (expanded.includes(id)) {
				setExpanded(prev => prev.filter(i => i !== id));
			} else {
				setExpanded((prev) => [...prev, id]);
			}
		}
	};
}

function flattenRows<TData, TId>(
	data: TData[],
	expanded: TId[],
	getId: (data: TData) => TId,
	getChildren: (data: TData) => TData[],
	currentLevel: number = 0,
	visible: boolean = true
): FlattenRow<TData, TId>[] {
	const result: FlattenRow<TData, TId>[] = [];
	for (const datum of data) {
		const children = getChildren(datum);

		const row: FlattenRow<TData, TId> = {
			data: datum,
			id: getId(datum),
			level: currentLevel,
			hasChildren: children.length > 0,
			expanded: expanded.includes(getId(datum)),
			visible: visible
		};

		result.push(row);
		result.push(...flattenRows(children, expanded, getId, getChildren, currentLevel + 1, row.expanded && row.visible));
	}

	return result;
}
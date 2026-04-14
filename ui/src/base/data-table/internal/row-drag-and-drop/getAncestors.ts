import { FlattenRow } from '@/base/data-table/internal/useFlattenRows.ts';

export function getAncestors<TData, TId>(target: FlattenRow<TData, TId>, allRows: FlattenRow<TData, TId>[]): FlattenRow<TData, TId>[] {
	if (target.level === 0) {
		return [];
	}

	const targetIndex = allRows.findIndex(row => row.id === target.id);
	if (targetIndex === -1) {
		return [];
	}

	for (let i = targetIndex - 1; i >= 0; i--) {
		if (allRows[i].level === target.level - 1) {
			return [...getAncestors(allRows[i], allRows), allRows[i]];
		}
	}

	return [];
}
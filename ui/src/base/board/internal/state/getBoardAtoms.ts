import { atom } from 'jotai';
import { BoardItemMoveEvent, BoardProps } from '@/base/board';
import { atomFactory } from '@/base/jotai-x/atomFactory';

export const getBoardAtoms = atomFactory(<TData, TColumnId>() => {
	const propsAtom = atom<BoardProps<TData, TColumnId>>(void 0 as unknown as BoardProps<TData, TColumnId>);

	const createButtonPendingAtom = atom(false);
	const createItemActionAtom = atom(
		null,
		async (get, set, column: TColumnId) => {
			const boardProps = get(propsAtom);
			set(createButtonPendingAtom, true);
			await boardProps.onCreateItem(column);
			set(createButtonPendingAtom, false);
		}
	);

	const showLoadingOverlayAtom = atom(false);

	const groupedItemIdsAtom = atom(
		get => {
			const props = get(propsAtom);
			return Object.fromEntries(
				props.columns.map(column => [
					`${column.columnId}`,
					props.items.filter(item => props.itemColumnSelector(item) === column.columnId)
						.map(item => props.itemIdSelector(item))
				])
			);
		}
	);

	const optimisticGroupedItemIdsAtom = atom<Record<string, string[]> | null>(null);

	const actualGroupedItemIdsAtom = atom<Record<string, string[]>>(
		get => get(optimisticGroupedItemIdsAtom) ?? get(groupedItemIdsAtom)
	);

	const itemMoveActionAtom = atom(
		null,
		(get, set, changeEvent: BoardItemMoveEvent<TData, TColumnId>) => {
			const props = get(propsAtom);
			set(showLoadingOverlayAtom, true);
			Promise.resolve(props.onItemMove(changeEvent))
				.finally(() => {
					set(optimisticGroupedItemIdsAtom, null);
					set(showLoadingOverlayAtom, false);
				});
		}
	)

	return {
		propsAtom, createButtonPendingAtom, createItemActionAtom,
		optimisticGroupedItemIdsAtom, actualGroupedItemIdsAtom,
		showLoadingOverlayAtom, itemMoveActionAtom
	};
});

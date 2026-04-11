import { atom } from 'jotai';
import { BoardItemMoveEvent, BoardProps } from '@/base/board';
import { atomFactory } from '@/base/jotai-x/atomFactory';
import { atomWithCompare } from '@/base/jotai-x/atomWithCompare';
import { shallowEqual } from '@mantine/hooks';

export const getBoardAtoms = atomFactory(<TData, TColumnId>() => {
	const _propsAtom = atomWithCompare<BoardProps<TData, TColumnId>>(
		void 0 as unknown as BoardProps<TData, TColumnId>,
		(a, b) => shallowEqual(a, b)
	);
	const _isItemCreationPendingAtom = atom(false);
	const _isItemMovePendingAtom = atom(false);
	const _draggedItemAtom = atom<TData | null>(null);

	const propsAtom = atom<BoardProps<TData, TColumnId>>((get) => get(_propsAtom));
	const setPropsActionAtom = atom(
		null,
		(_get, set, props: BoardProps<TData, TColumnId>) => {
			set(_propsAtom, props);
		}
	)

	const createButtonPendingAtom = atom(get => get(_isItemCreationPendingAtom));
	const createItemActionAtom = atom(
		null,
		async (get, set, column: TColumnId) => {
			const boardProps = get(propsAtom);
			set(_isItemCreationPendingAtom, true);
			await boardProps.onCreateItem(column);
			set(_isItemCreationPendingAtom, false);
		}
	);

	const showLoadingOverlayAtom = atom(get => get(_isItemMovePendingAtom));

	const draggedItemAtom = atom(get => get(_draggedItemAtom));
	const dragStartActionAtom = atom(
		null,
		(_get, set, item: TData) => set(_draggedItemAtom, item),
	);

	const dropTargetItemAtom = atom<
		| { afterItem: TData }
		| { beforeItem: TData }
		| null
	>(null);

	const dropTargetColumnAtom = atom<{ column: TColumnId } | null>(null);

	const dropActionAtom = atom(
		null,
		(get, set) => {
			const boardProps = get(propsAtom);
			const item = get(_draggedItemAtom);
			const dropTargetItem = get(dropTargetItemAtom);
			const dropTargetColumn = get(dropTargetColumnAtom);

			if (!item) {
				return;
			}

			const isBeforeSelf = dropTargetItem && 'beforeItem' in dropTargetItem && dropTargetItem.beforeItem === item;
			const isAfterSelf = dropTargetItem && 'afterItem' in dropTargetItem && dropTargetItem.afterItem === item;

			if (
				isBeforeSelf || isAfterSelf
			) {
				set(_draggedItemAtom, null);
				set(dropTargetColumnAtom, null);
				set(dropTargetItemAtom, null);
				return;
			}

			const newColumnId = dropTargetColumn?.column || boardProps.itemColumnSelector(item);
			const newColumn = boardProps.columns.find(c => c.columnId === newColumnId);
			if (!newColumn) {
				throw new Error(`Unable to find column ${newColumnId}`);
			}
			const newColumnItems = boardProps.items
				.filter(i => i !== item)
				.filter(item => boardProps.itemColumnSelector(item) === newColumnId)
				.flatMap((i, index, arr): TData[] => {
					if (dropTargetItem === null) {
						return index === arr.length - 1 ? [i, item] : [i];
					} else if ('beforeItem' in dropTargetItem) {
						return i === dropTargetItem.beforeItem ? [item, i] : [i];
					} else if ('afterItem' in dropTargetItem) {
						return i === dropTargetItem.afterItem ? [i, item] : [i];
					}
					return [i];
				});
			const newIndexInColumn = newColumnItems.indexOf(item);

			const moveEvent: BoardItemMoveEvent<TData, TColumnId> = {
				item,
				newColumn,
				newColumnItems,
				newIndexInColumn
			}

			set(_isItemMovePendingAtom, true);
			Promise.resolve(boardProps.onItemMove(moveEvent))
				.finally(
					() => {
						set(_isItemMovePendingAtom, false);
						set(_draggedItemAtom, null);
						set(dropTargetColumnAtom, null);
						set(dropTargetItemAtom, null);
					}
				)
		}
	)

	return {
		propsAtom, setPropsActionAtom,
		createButtonPendingAtom, createItemActionAtom,
		showLoadingOverlayAtom,
		draggedItemAtom, dragStartActionAtom, dropTargetItemAtom, dropTargetColumnAtom, dropActionAtom
	};
});

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

	const itemMoveActionAtom = atom(
		null,
		(get, set, changeEvent: BoardItemMoveEvent<TData, TColumnId>) => {
			const props = get(propsAtom);
			set(showLoadingOverlayAtom, true);
			Promise.resolve(props.onItemMove(changeEvent))
				.finally(() => {
					set(showLoadingOverlayAtom, false);
				});
		}
	)

	const draggedItem = atom<TData | null>(null);

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
			const item = get(draggedItem);
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
				set(draggedItem, null);
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

			set(showLoadingOverlayAtom, true);
			Promise.resolve(boardProps.onItemMove(moveEvent))
				.finally(
					() => {
						set(showLoadingOverlayAtom, false);
						set(draggedItem, null);
						set(dropTargetColumnAtom, null);
						set(dropTargetItemAtom, null);
					}
				)
		}
	)

	return {
		propsAtom, createButtonPendingAtom, createItemActionAtom,
		showLoadingOverlayAtom, itemMoveActionAtom,
		draggedItem, dropTargetItemAtom, dropTargetColumnAtom, dropActionAtom
	};
});

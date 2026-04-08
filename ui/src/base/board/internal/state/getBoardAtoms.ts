import { atom } from 'jotai';
import { BoardProps } from '@/base/board';
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
	)
	return {
		propsAtom, createButtonPendingAtom, createItemActionAtom
	};
});

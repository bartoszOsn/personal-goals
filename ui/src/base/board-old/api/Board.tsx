import { BoardProps } from '@/base/board-old/api/BoardProps';
import { BoardMain } from '@/base/board-old/internal/BoardMain';
import { useEffect, useState } from 'react';
import { createStore, Provider } from 'jotai';
import { getBoardAtoms } from '@/base/board-old/internal/state/getBoardAtoms';

export function Board<TData, TColumnId>(props: BoardProps<TData, TColumnId>) {
	const [store] = useState(() => {
		const store = createStore();
		store.set(getBoardAtoms<TData, TColumnId>().setPropsActionAtom, props);
		return store;
	});

	useEffect(() => {
		store.set(getBoardAtoms<TData, TColumnId>().setPropsActionAtom, props);
	}, [props, store]);

	return (
		<Provider store={store}>
			<BoardMain />
		</Provider>
	)
}
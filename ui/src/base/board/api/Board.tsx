import { BoardProps } from '@/base/board/api/BoardProps';
import { BoardMain } from '@/base/board/internal/BoardMain';
import { useState } from 'react';
import { createStore, Provider } from 'jotai';
import { getBoardAtoms } from '@/base/board/internal/state/getBoardAtoms';

export function Board<TData, TColumnId>(props: BoardProps<TData, TColumnId>) {
	const [store] = useState(() => createStore());

	store.set(getBoardAtoms<TData, TColumnId>().propsAtom, props);

	return (
		<Provider store={store}>
			<BoardMain />
		</Provider>
	)
}
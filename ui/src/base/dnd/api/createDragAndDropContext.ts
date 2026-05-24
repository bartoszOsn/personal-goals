export function createDragAndDropContext<TDragPayload, TDropPayload>(): DragAndDropContext<TDragPayload, TDropPayload> {
	const contextSymbol = Symbol('dnd-context');
	return {
		dndContextSymbol: contextSymbol,
		wrapDragPayload: (payload) => ({ dndContextSymbol: contextSymbol, dragPayload: payload }),
		unwrapDragPayload: (payload) => {
			if (payload.dndContextSymbol !== contextSymbol) {
				throw new Error('Invalid drag payload context');
			}
			return payload.dragPayload;
		},
		isMatchingDragPayload: (payload): payload is DragPayload<TDragPayload> => payload !== null && typeof payload === 'object' && 'dndContextSymbol' in payload && payload.dndContextSymbol === contextSymbol,

		wrapDropPayload: (payload) => ({ dndContextSymbol: contextSymbol, dropPayload: payload }),
		unwrapDropPayload: (payload) => {
			if (payload.dndContextSymbol !== contextSymbol) {
				throw new Error('Invalid drop payload context');
			}
			return payload.dropPayload;
		},
		isMatchingDropPayload: (payload): payload is DropPayload<TDropPayload> => payload !== null && typeof payload === 'object' && 'dndContextSymbol' in payload && payload.dndContextSymbol === contextSymbol,
	};
}

export interface DragAndDropContext<TDragPayload, TDropPayload> extends DragAndDropContextAware {
	wrapDragPayload: (payload: TDragPayload) => DragPayload<TDragPayload>;
	unwrapDragPayload: (payload: DragPayload<TDragPayload>) => TDragPayload;
	isMatchingDragPayload: (payload: unknown) => payload is DragPayload<TDragPayload>;

	wrapDropPayload: (payload: TDropPayload) => DropPayload<TDropPayload>;
	unwrapDropPayload: (payload: DropPayload<TDropPayload>) => TDropPayload;
	isMatchingDropPayload: (payload: unknown) => payload is DropPayload<TDropPayload>;
}

export interface DragPayload<TDragPayload> extends DragAndDropContextAware, Record<string, unknown> {
	dragPayload: TDragPayload;
}

export interface DropPayload<TDropPayload> extends DragAndDropContextAware, Record<string | symbol, unknown> {
	dropPayload: TDropPayload;
}

export interface DragAndDropContextAware {
	dndContextSymbol: symbol;
}
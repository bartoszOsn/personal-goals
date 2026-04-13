import { AnyActionArg, useCallback, useLayoutEffect, useRef, useState } from 'react';

export type OpaqueActionDispatch<ActionArg extends AnyActionArg, State> = (...args: ActionArg) => State;

export function useOpaqueReducer<S, A extends AnyActionArg>(
	reducer: (prevState: S, ...args: A) => S,
	initialState: S,
): [S, OpaqueActionDispatch<A, S>];
export function useOpaqueReducer<S, I, A extends AnyActionArg>(
	reducer: (prevState: S, ...args: A) => S,
	initialArg: I,
	init: (i: I) => S,
): [S, OpaqueActionDispatch<A, S>];
export function useOpaqueReducer<S, I, A extends AnyActionArg>(
	reducer: (prevState: S, ...args: A) => S,
	initialArgOrInitialState: I | S,
	init?: (i: I) => S,
): [S, OpaqueActionDispatch<A, S>] {
	const [state, setState] = useState(() => (init ? init(initialArgOrInitialState as I) : (initialArgOrInitialState as S)));

	const stateRef = useRef(state);
	const reducerRef = useRef(reducer);

	useLayoutEffect(() => {
		reducerRef.current = reducer;
	});

	const dispatch = useCallback((...args: A) => {
		const nextState = reducerRef.current(stateRef.current, ...args);
		stateRef.current = nextState;
		setState(nextState);
		return nextState;
	}, []);

	return [state, dispatch];
}
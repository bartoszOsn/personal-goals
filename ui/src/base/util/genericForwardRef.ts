import { ForwardedRef, forwardRef, PropsWithoutRef, ReactNode, RefAttributes } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export function genericForwardRef<T, P = {}>(
	render: (props: PropsWithoutRef<P>, ref: ForwardedRef<T>) => ReactNode
): (props: P & RefAttributes<T>) => ReactNode {
	return forwardRef(render) as (props: P & RefAttributes<T>) => ReactNode;
}
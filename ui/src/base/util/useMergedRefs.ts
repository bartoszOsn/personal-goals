import { ForwardedRef } from 'react';

export function useMergedRefs<T>(...refs: (ForwardedRef<T> | null | undefined)[]): ForwardedRef<T> {
	return (instance: T | null) => {
		for (const ref of refs.filter(Boolean)) {
			if (typeof ref === 'function') {
				ref(instance);
			} else if (ref) {
				ref.current = instance;
			}
		}
	};
}
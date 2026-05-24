import { ForwardedRef } from 'react';

export function useMergedRefs<T>(...refs: ForwardedRef<T>[]): ForwardedRef<T> {
	return (instance: T | null) => {
		for (const ref of refs) {
			if (typeof ref === 'function') {
				ref(instance);
			} else if (ref) {
				ref.current = instance;
			}
		}
	};
}
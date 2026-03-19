import { DefaultError, MutationCacheNotifyEvent, MutationObserver, MutationObserverResult, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useMutationError(handler: (err: DefaultError) => void) {
	const queryClient = useQueryClient();

	useEffect(() => {
		const onError = (result: MutationObserverResult) => {
			if (result.isError) {
				handler(result.error)
			}
		}

		const subscribedObserversToUnsub = new Map<MutationObserver, () => void>();

		const unsub = queryClient.getMutationCache().subscribe((event: MutationCacheNotifyEvent) => {
			if (event.type === 'observerAdded' && !event.mutation.meta?.silent) {
				subscribedObserversToUnsub.set(
					event.observer,
					event.observer.subscribe(onError)
				);
			} else if (event.type === 'observerRemoved') {
				subscribedObserversToUnsub.get(event.observer)?.();
			}
		});

		return () => {
			unsub();
			for (const unsubMutation of subscribedObserversToUnsub.values()) {
				unsubMutation();
			}
		}
	}, [handler, queryClient]);
}
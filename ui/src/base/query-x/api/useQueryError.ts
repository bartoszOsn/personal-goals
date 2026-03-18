import { DefaultError, QueryCacheNotifyEvent, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useQueryError(handler: (err: DefaultError) => void) {
	const queryClient = useQueryClient();

	useEffect(() => {
		const unsub = queryClient.getQueryCache().subscribe((event: QueryCacheNotifyEvent) => {
			if (event.type === 'observerResultsUpdated') {
				if (event.query.state.status === 'error') {
					handler(event.query.state.error)
				}
			}
		});

		return () => {
			unsub();
		}
	}, [handler, queryClient]);
}
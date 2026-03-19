import type { DefaultError, QueryKey } from '@tanstack/query-core';
import { QueryClient, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';

export interface CreateQueryOptions<
	TContextOptions extends Array<unknown>,
	TQueryFnData = unknown,
	TError = DefaultError,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey,
> {
	(queryClient: QueryClient, ...contextOptions: TContextOptions): UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>;
}

export function createQuery<
	TContextOptions extends Array<unknown>,
	TQueryFnData = unknown,
	TError = DefaultError,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey,
>(createOptions: CreateQueryOptions<TContextOptions, TQueryFnData, TError, TData, TQueryKey>) {
	return Object.assign(
		(...contextOptions: TContextOptions) => {
			const queryClient = useQueryClient();
			const options = createOptions(queryClient, ...contextOptions);
			return useQuery(options);
		},
		{
			silent: (...contextOptions: TContextOptions) => {
				// eslint-disable-next-line react-hooks/rules-of-hooks
				const queryClient = useQueryClient();
				const options = createOptions(queryClient, ...contextOptions);
				// eslint-disable-next-line react-hooks/rules-of-hooks
				return useQuery({
					...options,
					meta: {
						...options.meta,
						silent: true
					}
				});
			}
		}
	);
}
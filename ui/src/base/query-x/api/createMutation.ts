import type { DefaultError } from '@tanstack/query-core';
import { QueryClient, useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';

export interface CreateMutationOptions<
	TContextOptions extends Array<unknown>,
	TData = unknown,
	TError = DefaultError,
	TVariables = void,
	TOnMutateResult = unknown,
> {
	(queryClient: QueryClient, ...contextOptions: TContextOptions): UseMutationOptions<TData, TError, TVariables, TOnMutateResult>;
}

export function createMutation<
	TContextOptions extends Array<unknown>,
	TData = unknown,
	TError = DefaultError,
	TVariables = void,
	TOnMutateResult = unknown,
>(createOptions: CreateMutationOptions<TContextOptions, TData, TError, TVariables, TOnMutateResult>) {
	return Object.assign(
		(...contextOptions: TContextOptions) => {
			const queryClient = useQueryClient();
			const options = createOptions(queryClient, ...contextOptions);
			return useMutation(options);
		},
		{
			silent: (...contextOptions: TContextOptions) => {
				// eslint-disable-next-line react-hooks/rules-of-hooks
				const queryClient = useQueryClient();
				const options = createOptions(queryClient, ...contextOptions);
				// eslint-disable-next-line react-hooks/rules-of-hooks
				return useMutation({
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
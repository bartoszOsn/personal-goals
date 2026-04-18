import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { defaultRetry, handleUnauthorizedError } from '@/api/auth/query-auth';

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (err) => {
			handleUnauthorizedError(err);
		}
	}),
	mutationCache: new MutationCache({
		onError: (err) => {
			handleUnauthorizedError(err);
		}
	}),
	defaultOptions: {
		queries: {
			retry: defaultRetry,
		}
	}
});

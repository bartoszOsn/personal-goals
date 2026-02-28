import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { defaultRetry, getTokenFromLS, onError, setToken } from '@/api/auth/query-auth';

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (err) => {
			onError(err, queryClient);
		}
	}),
	mutationCache: new MutationCache({
		onError: (err) => {
			onError(err, queryClient);
		}
	}),
	defaultOptions: {
		queries: {
			retry: defaultRetry,
		}
	}
});

setToken(getTokenFromLS(), queryClient);
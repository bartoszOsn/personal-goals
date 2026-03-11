import { http, HttpError } from '@/base/http';
import { router } from '@/router.tsx';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { Temporal } from 'temporal-polyfill';

const tokenKey = ['internal', 'token'];

export function onError(err: HttpError, queryClient: QueryClient) {
	if (HttpError.is(err, 401)) {
		setToken(null, queryClient);
	}
}

export function defaultRetry(count: number, err: HttpError) {
	if (HttpError.is(err, 401)) {
		return false;
	}
	return count < 3;
}

export function setToken (token: string | null, queryClient: QueryClient) {
	if (token === null) {
		localStorage.removeItem('token');
		queryClient.setQueryData(tokenKey, null);
		http.setAuthToken(null);
		router.navigate({ to: '/auth/login'}).then();
	} else {
		localStorage.setItem('token', token);
		queryClient.setQueryData(tokenKey, token);
		http.setAuthToken(token);
		if (router.state.matches.some(math => math.routeId === '/auth')) {
			router.navigate({ to: '/work/$context', params: { context: Temporal.Now.plainDateISO().year.toString() }})
				.then();
		}
	}
}

export function getTokenFromLS() {
	return localStorage.getItem('token');
}

export function useToken(): string | null {
	const { data } = useQuery({
		queryKey: tokenKey
	});
	return data as string | null ?? null
}
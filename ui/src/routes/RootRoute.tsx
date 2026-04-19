import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useFirebaseAuthReady } from '@/api/auth/useFirebaseAuthReady';
import { LoadingOverlay } from '@mantine/core';

export function RootRoute() {
	const isAuthReady = useFirebaseAuthReady();

	if (!isAuthReady) {
		return <LoadingOverlay visible={true} />
	}

	return (
		<>
			<Outlet />
			<TanStackRouterDevtools />
		</>
	)
}
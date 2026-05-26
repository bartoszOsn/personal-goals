import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useFirebaseAuthReady } from '@/api/auth/useFirebaseAuthReady';
import { Spinner } from '@/primitive/components/ui/spinner';

export function RootRoute() {
	const isAuthReady = useFirebaseAuthReady();

	if (!isAuthReady) {
		return <div className='absolute inset-0 min-h-screen w-full flex items-center justify-center'>
			<Spinner className='size-10' />
		</div>
	}

	return (
		<>
			<Outlet />
			<TanStackRouterDevtools position="bottom-right" />
		</>
	)
}
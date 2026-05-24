import { Navigate, Outlet } from '@tanstack/react-router';
import './AuthRoute.css';
import { useFirebaseUser } from '@/api/auth/useFirebaseUser';

export function AuthRoute() {
	const user = useFirebaseUser();

	if (user) {
		return <Navigate to='/' />
	}

	return (
		<div className='flex w-full min-h-screen bg-muted items-center justify-center sm:py-4'>
			<Outlet />
		</div>
	)
}
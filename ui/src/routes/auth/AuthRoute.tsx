import { Stack } from '@mantine/core';
import { Navigate, Outlet } from '@tanstack/react-router';
import './AuthRoute.css';
import { useFirebaseUser } from '@/api/auth/useFirebaseUser';

export function AuthRoute() {
	const user = useFirebaseUser();

	if (user) {
		return <Navigate to='/' />
	}

	return (
		<Stack w="100%" h="100vh" bg='gray.1' align='center' justify='center'>
			<Outlet />
		</Stack>
	)
}
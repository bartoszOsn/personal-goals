import { Stack } from '@mantine/core';
import { Outlet } from '@tanstack/react-router';

export function AuthRoute() {
	return (
		<Stack w="100%" h="100vh" bg='gray.1' align='center' justify='center'>
			<Outlet />
		</Stack>
	)
}
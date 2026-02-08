import { Outlet } from '@tanstack/react-router';
import { AppSidebar } from '@/routes/work/AppSidebar.tsx';
import { AppShell } from '@mantine/core';

export function WorkRoute() {
	return (
		<AppShell navbar={{
			width: 250,
			breakpoint: 'sm'
		}}>
			<AppSidebar />
			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
}
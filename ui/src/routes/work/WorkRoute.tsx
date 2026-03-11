import { getRouteApi, Outlet, useNavigate } from '@tanstack/react-router';
import { AppSidebar } from '@/routes/work/AppSidebar.tsx';
import { AppShell } from '@mantine/core';
import { useCallback } from 'react';
import { Temporal } from 'temporal-polyfill';

export function WorkRoute() {
	const navigate = useNavigate();
	const context = getRouteApi('/work/$context')
		.useParams({
			select: (params) => isNaN(+params.context) ? Temporal.Now.plainDateISO().year : +params.context
		});

	const setContext = useCallback((context: number) => {
		navigate({ to: '.', params: (prev) => ({ ...prev, context: context.toString() }) })
			.then();
	}, [navigate]);

	return (
		<AppShell navbar={{
			width: 250,
			breakpoint: 'sm'
		}}>
			<AppSidebar context={context} setContext={setContext} />
			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
}
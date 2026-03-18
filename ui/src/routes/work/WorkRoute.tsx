import { getRouteApi, Outlet, useNavigate } from '@tanstack/react-router';
import { AppSidebar } from '@/routes/work/AppSidebar.tsx';
import { AppShell } from '@mantine/core';
import { useCallback } from 'react';
import { Temporal } from 'temporal-polyfill';
import { AppHeader } from '@/routes/work/AppHeader';
import { notifications } from '@mantine/notifications';
import { useQueryOrMutationError } from '@/base/query-x/api/useQueryOrMutationError';

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

	useQueryOrMutationError(err => {
		notifications.show({
			color: 'red',
			title: `Http error ${err.statusCode}`,
			message: 'Unknown error'
		});
	});

	return (
		<AppShell navbar={{
			width: 250,
			breakpoint: 'sm'
		}} header={{
			height: 50
		}}>
			<AppHeader context={context} setContext={setContext} />
			<AppSidebar context={context} />
			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
}
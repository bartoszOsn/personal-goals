import { getRouteApi, Outlet, useNavigate } from '@tanstack/react-router';
import { AppSidebar } from '@/routes/work/AppSidebar.tsx';
import { AppShell } from '@mantine/core';
import { Temporal } from 'temporal-polyfill';
import { AppHeader } from '@/routes/work/AppHeader';
import { notifications } from '@mantine/notifications';
import { useQueryOrMutationError } from '@/base/query-x/api/useQueryOrMutationError';
import { BasicErrorDTOSchema } from '@personal-okr/shared';
import { HttpError } from '@/base/http';

export function WorkRoute() {
	const navigate = useNavigate();
	const context = getRouteApi('/work/$context')
		.useParams({
			select: (params) => isNaN(+params.context) ? Temporal.Now.plainDateISO().year : +params.context
		});

	const setContext = (context: number) => {
		navigate({ to: '.', params: (prev) => ({ ...prev, context: context.toString() }) })
			.then();
	}

	useQueryOrMutationError(err => {
		if (HttpError.is(err, BasicErrorDTOSchema)) {
			if (err.data.code === 401) {
				return;
			}

			notifications.show({
				color: err.data.severity === 'error' ? 'red' : 'yellow',
				title: err.data.title,
				message: err.data.message
			});
		}
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
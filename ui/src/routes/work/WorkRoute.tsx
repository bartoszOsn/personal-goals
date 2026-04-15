import { getRouteApi, Outlet, useNavigate, useRouter } from '@tanstack/react-router';
import { AppSidebar } from '@/routes/work/AppSidebar.tsx';
import { AppShell, useMantineTheme } from '@mantine/core';
import { Temporal } from 'temporal-polyfill';
import { AppHeader } from '@/routes/work/AppHeader';
import { notifications } from '@mantine/notifications';
import { useQueryOrMutationError } from '@/base/query-x/api/useQueryOrMutationError';
import { BasicErrorDTOSchema } from '@personal-okr/shared';
import { HttpError } from '@/base/http';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';

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

	const theme = useMantineTheme();
	const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
	const [navbarCollapsed, setNavbarCollapsed] = useState<boolean>(true);

	const router = useRouter();

	useEffect(() => {
		return router.subscribe('onBeforeNavigate', () => {
			if (isMobile) {
				setNavbarCollapsed(true);
			}
		})
	}, [isMobile, router]);

	return (
		<AppShell navbar={{
			width: 250,
			breakpoint: 'sm',
			collapsed: { mobile: navbarCollapsed, desktop: navbarCollapsed },
		}} header={{
			height: 50
		}}>
			<AppHeader context={context} setContext={setContext} navbarCollapsed={navbarCollapsed} setNavbarCollapsed={setNavbarCollapsed} />
			<AppSidebar context={context} />
			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
}
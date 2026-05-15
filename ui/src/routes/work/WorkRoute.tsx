import { getRouteApi, Navigate, Outlet, useNavigate } from '@tanstack/react-router';
import { AppSidebar } from '@/routes/work/AppSidebar.tsx';
import { Temporal } from 'temporal-polyfill';
import { notifications } from '@mantine/notifications';
import { useQueryOrMutationError } from '@/base/query-x/api/useQueryOrMutationError';
import { BasicErrorDTOSchema } from '@personal-okr/shared';
import { HttpError } from '@/base/http';
import { useFirebaseUser } from '@/api/auth/useFirebaseUser';
import { SidebarProvider, SidebarTrigger } from '@/primitive/components/ui/sidebar';

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

	const user = useFirebaseUser();

	if (!user) {
		return <Navigate to='/auth/login' />
	}

	return (
		<SidebarProvider className='overflow-y-hidden'>
			<AppSidebar context={context} setContext={setContext} />
			<main className='overflow-y-hidden'>
				<SidebarTrigger className='absolute' />
				<Outlet />
			</main>
		</SidebarProvider>
	);
}
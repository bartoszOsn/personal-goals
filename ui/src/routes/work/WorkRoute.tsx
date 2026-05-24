import { getRouteApi, Navigate, Outlet, useNavigate } from '@tanstack/react-router';
import { AppSidebar } from '@/routes/work/AppSidebar.tsx';
import { Temporal } from 'temporal-polyfill';
import { useQueryOrMutationError } from '@/base/query-x/api/useQueryOrMutationError';
import { BasicErrorDTOSchema } from '@personal-okr/shared';
import { HttpError } from '@/base/http';
import { useFirebaseUser } from '@/api/auth/useFirebaseUser';
import { SidebarProvider } from '@/primitive/components/ui/sidebar';
import { toast } from 'sonner';

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

			toast.error(err.data.title, {
				description: err.data.message
			});
		}
	});

	const user = useFirebaseUser();

	if (!user) {
		return <Navigate to='/auth/login' />
	}

	return (
		<SidebarProvider>
			<AppSidebar context={context} setContext={setContext} />
			<Outlet />
		</SidebarProvider>
	);
}
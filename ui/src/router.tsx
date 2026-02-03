import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { IndexRoute } from '@/routes/IndexRoute.tsx';
import { WorkRoute } from '@/routes/work/WorkRoute.tsx';
import { OKRsRoute } from '@/routes/work/OKRs/OKRsRoute.tsx';
import { OKRProgressMatrixRoute } from '@/routes/work/okr-progress-matrix/OKRProgressMatrixRoute.tsx';
import { TasksRoute } from '@/routes/work/tasks/TasksRoute.tsx';
import { TaskBacklogRoute } from '@/routes/work/tasks-backlog/TaskBacklogRoute.tsx';
import { TaskCalendarRoute } from '@/routes/work/tasks-calendar/TaskCalendarRoute.tsx';
import { SprintSettingsRoute } from '@/routes/work/sprint-settings/SprintSettingsRoute.tsx';

const rootRoute = createRootRoute({
	component: () => (
		<>
			<Outlet />
			<TanStackRouterDevtools />
		</>
	),
})

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: IndexRoute,
});

const workRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/work",
	component: WorkRoute
});

const okrsRoute = createRoute({
	getParentRoute: () => workRoute,
	path: "/okrs",
	component: OKRsRoute
});

const okrsProgressMatrixRoute = createRoute({
	getParentRoute: () => workRoute,
	path: "/okrs/progress-matrix",
	component: OKRProgressMatrixRoute
});

const tasksRoute = createRoute({
	getParentRoute: () => workRoute,
	path: "/tasks",
	component: TasksRoute
});

const tasksBacklogRoute = createRoute({
	getParentRoute: () => workRoute,
	path: "/tasks/backlog",
	component: TaskBacklogRoute
});

const tasksCalendarRoute = createRoute({
	getParentRoute: () => workRoute,
	path: "/tasks/calendar",
	component: TaskCalendarRoute
});

const sprintSettings = createRoute({
	getParentRoute: () => workRoute,
	path: "/sprint-settings",
	component: SprintSettingsRoute
})

const routeTree = rootRoute.addChildren([
	indexRoute,
	workRoute.addChildren([
		okrsRoute,
		okrsProgressMatrixRoute,
		tasksRoute,
		tasksBacklogRoute,
		tasksCalendarRoute,
		sprintSettings
	])
]);

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}
}
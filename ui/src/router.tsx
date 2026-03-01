import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { IndexRoute } from '@/routes/IndexRoute.tsx';
import { WorkRoute } from '@/routes/work/WorkRoute.tsx';
import { OKRsRoute } from '@/routes/work/OKRs/OKRsRoute.tsx';
import { TasksRoute } from '@/routes/work/tasks/TasksRoute.tsx';
import { SprintSettingsRoute } from '@/routes/work/sprint-settings/SprintSettingsRoute.tsx';
import { AuthRoute } from '@/routes/auth/AuthRoute';
import { LoginRoute } from '@/routes/auth/login/LoginRoute';
import { RegisterRoute } from '@/routes/auth/RegisterRoute';
import { SprintOverviewRoute } from '@/routes/work/sprint-overview/SprintOverviewRoute';
import { RoadmapRoute } from '@/routes/work/roadmap/RoadmapRoute';

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

const sprintOverviewRoute = createRoute({
	getParentRoute: () => workRoute,
	path: `/sprint-overview/{-$sprintId}`,
	component: SprintOverviewRoute
});

const roadmapRoute = createRoute({
	getParentRoute: () => workRoute,
	path: "/roadmap",
	component: RoadmapRoute
});

const okrsRoute = createRoute({
	getParentRoute: () => workRoute,
	path: "/okrs",
	component: OKRsRoute
});

const tasksRoute = createRoute({
	getParentRoute: () => workRoute,
	path: "/tasks",
	component: TasksRoute
});

const sprintSettings = createRoute({
	getParentRoute: () => workRoute,
	path: "/sprint-settings",
	component: SprintSettingsRoute
});

const authRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/auth",
	component: AuthRoute
});

const loginRoute = createRoute({
	getParentRoute: () => authRoute,
	path: "/login",
	component: LoginRoute
});

const registerRoute = createRoute({
	getParentRoute: () => authRoute,
	path: "/register",
	component: RegisterRoute
});

const routeTree = rootRoute.addChildren([
	indexRoute,
	workRoute.addChildren([
		sprintOverviewRoute,
		roadmapRoute,
		okrsRoute,
		tasksRoute,
		sprintSettings
	]),
	authRoute.addChildren([
		loginRoute,
		registerRoute
	])
]);

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}
}
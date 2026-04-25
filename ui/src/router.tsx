import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { IndexRoute } from '@/routes/IndexRoute.tsx';
import { WorkRoute } from '@/routes/work/WorkRoute.tsx';
import { SprintSettingsRoute } from '@/routes/work/sprint-settings/SprintSettingsRoute.tsx';
import { AuthRoute } from '@/routes/auth/AuthRoute';
import { LoginRoute } from '@/routes/auth/login/LoginRoute';
import { RegisterRoute } from '@/routes/auth/register/RegisterRoute';
import { SprintOverviewRoute } from '@/routes/work/sprint-overview/SprintOverviewRoute';
import { RoadmapRoute } from '@/routes/work/roadmap/RoadmapRoute';
import { DetailsRoute } from '@/routes/work/details/DetailsRoute';
import { DocumentRoute } from '@/routes/work/document/DocumentRoute';
import { RootRoute } from '@/routes/RootRoute';
import { ForgotPasswordRoute } from '@/routes/auth/forgot-password/ForgotPasswordRoute';
import { ProfileRoute } from '@/routes/work/profile/ProfileRoute';

const rootRoute = createRootRoute({
	component: RootRoute
})

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: IndexRoute,
});

const workRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/work/$context",
	component: WorkRoute
});

const sprintOverviewRoute = createRoute({
	getParentRoute: () => workRoute,
	path: `/sprint-overview/{-$sprintId}`,
	component: SprintOverviewRoute
});

const roadmapV2Route = createRoute({
	getParentRoute: () => workRoute,
	path: '/roadmap',
	component: RoadmapRoute
});

const sprintSettings = createRoute({
	getParentRoute: () => workRoute,
	path: "/sprint-settings",
	component: SprintSettingsRoute
});

const detailsRoute = createRoute({
	getParentRoute: () => workRoute,
	path: '/details/$workItemId',
	component: DetailsRoute
});

const documentRoute = createRoute({
	getParentRoute: () => workRoute,
	path: '/document/$documentId',
	component: DocumentRoute
});

const profileRoute = createRoute({
	getParentRoute: () => workRoute,
	path: '/profile',
	component: ProfileRoute
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

const forgotPasswordRoute = createRoute({
	getParentRoute: () => authRoute,
	path: "/forgot-password",
	component: ForgotPasswordRoute
})

const routeTree = rootRoute.addChildren([
	indexRoute,
	workRoute.addChildren([
		sprintOverviewRoute,
		roadmapV2Route,
		detailsRoute,
		sprintSettings,
		documentRoute,
		profileRoute
	]),
	authRoute.addChildren([
		loginRoute,
		registerRoute,
		forgotPasswordRoute
	])
]);

export const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}
}
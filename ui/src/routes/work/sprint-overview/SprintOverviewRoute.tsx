import { getRouteApi, Navigate } from '@tanstack/react-router';
import { Temporal } from 'temporal-polyfill';
import { useSprintQuery } from '@/api/sprint/sprint-hooks.ts';
import { SprintOverviewSkeleton } from '@/routes/work/sprint-overview/SprintOverviewSkeleton.tsx';
import { SprintOverviewEmpty } from '@/routes/work/sprint-overview/SprintOverviewEmpty.tsx';
import { isPlainDate } from '@personal-okr/shared';

export function SprintOverviewRoute() {
	const context = getRouteApi('/work/$context/sprint-overview')
		.useParams({
			select: (params) => isNaN(+params.context) ? Temporal.Now.plainDateISO().year : +params.context
		});

	const sprints = useSprintQuery(context);
	const sprintToNavigate = (sprints.data ?? [])
		.find(sprint => {
			const start = sprint.startDate;
			const end = sprint.endDate;
			const now = Temporal.Now.plainDateISO();

			return isPlainDate(now).afterOrEqual(start) && isPlainDate(now).beforeOrEqual(end);
		}) ?? sprints.data?.[0];

	if (!sprints.data || sprints.isLoading) {
		return <SprintOverviewSkeleton />
	}

	if (sprints.data.length === 0 || !sprintToNavigate) {
		return <SprintOverviewEmpty context={context} />
	}

	return <Navigate to='/work/$context/sprint-overview/$sprintId' params={{ context: context.toString(), sprintId: sprintToNavigate.id }} />
}
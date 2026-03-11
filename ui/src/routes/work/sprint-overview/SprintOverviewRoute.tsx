import { getRouteApi } from '@tanstack/react-router';
import { SprintOverviewCurrentSprintLoader } from '@/routes/work/sprint-overview/SprintOverviewCurrentSprintLoader';
import { SprintOverview } from '@/routes/work/sprint-overview/SprintOverview';
import { SprintId } from '@/models/Sprint';
import { Temporal } from 'temporal-polyfill';

export function SprintOverviewRoute() {
	const sprintId = getRouteApi('/work/$context/sprint-overview/{-$sprintId}').useParams({
		select: (params) => params.sprintId as SprintId | undefined
	});
	const context = getRouteApi('/work/$context/sprint-overview/{-$sprintId}')
		.useParams({
			select: (params) => isNaN(+params.context) ? Temporal.Now.plainDateISO().year : +params.context
		});

	if (!sprintId) {
		return (
			<SprintOverviewCurrentSprintLoader />
		);
	}

	return (
		<SprintOverview context={context} sprintId={sprintId} />
	);
}
import { getRouteApi } from '@tanstack/react-router';
import { Temporal } from 'temporal-polyfill';
import { SprintId } from '@/models/Sprint';
import { SprintOverview } from '@/routes/work/sprint-overview/SprintOverview';

export function SprintOverviewSprintRoute() {
	const sprintId = getRouteApi('/work/$context/sprint-overview/$sprintId').useParams({
		select: (params) => params.sprintId as SprintId
	});
	const context = getRouteApi('/work/$context/sprint-overview/$sprintId')
		.useParams({
			select: (params) => isNaN(+params.context) ? Temporal.Now.plainDateISO().year : +params.context
		});

	return (
		<SprintOverview context={context} sprintId={sprintId} />
	);
}
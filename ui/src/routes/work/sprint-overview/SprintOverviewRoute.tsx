import { getRouteApi } from '@tanstack/react-router';
import { SprintOverviewCurrentSprintLoader } from '@/routes/work/sprint-overview/SprintOverviewCurrentSprintLoader';
import { SprintOverview } from '@/routes/work/sprint-overview/SprintOverview';

export function SprintOverviewRoute() {
	const sprintId = getRouteApi('/work/sprint-overview/{-$sprintId}').useParams({
		select: (params) => params.sprintId
	});

	if (!sprintId) {
		return (
			<SprintOverviewCurrentSprintLoader />
		);
	}

	return (
		<SprintOverview sprintId={sprintId} />
	);
}
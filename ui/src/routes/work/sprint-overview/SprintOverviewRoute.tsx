import { getRouteApi } from '@tanstack/react-router';
import { SprintOverviewCurrentSprintLoader } from '@/routes/work/sprint-overview/SprintOverviewCurrentSprintLoader';
import { SprintOverview } from '@/routes/work/sprint-overview/SprintOverview';
import { SprintId } from '@/models/Sprint';

export function SprintOverviewRoute() {
	const sprintId = getRouteApi('/work/sprint-overview/{-$sprintId}').useParams({
		select: (params) => params.sprintId as SprintId | undefined
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
import { getRouteApi } from '@tanstack/react-router';
import { Temporal } from 'temporal-polyfill';
import { RoadmapV2 } from '@/routes/work/roadmapV2/RoadmapV2';

export function RoadmapV2Route() {
	const context = getRouteApi('/work/$context/roadmap-v2')
		.useParams({
			select: (params) => isNaN(+params.context) ? Temporal.Now.plainDateISO().year : +params.context
		});
	return <RoadmapV2 context={context} />
}
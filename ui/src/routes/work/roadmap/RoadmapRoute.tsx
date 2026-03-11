import { getRouteApi } from '@tanstack/react-router';
import { Temporal } from 'temporal-polyfill';
import { Roadmap } from '@/routes/work/roadmap/Roadmap';

export function RoadmapRoute() {
	const context = getRouteApi('/work/$context/roadmap')
		.useParams({
			select: (params) => isNaN(+params.context) ? Temporal.Now.plainDateISO().year : +params.context
		});
	return <Roadmap context={context} />
}
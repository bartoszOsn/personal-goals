import { getRouteApi, Navigate, useNavigate } from '@tanstack/react-router';
import { Temporal } from 'temporal-polyfill';
import { RoadmapV2 } from '@/routes/work/roadmapV2/RoadmapV2';
import { useCallback } from 'react';

export function RoadmapV2Route() {
	const navigate = useNavigate();
	const context = getRouteApi('/work/roadmap-v2/{-$context}')
		.useParams({
			select: (params) => !params.context || isNaN(+params.context) ? undefined : +params.context
		});

	const setContext = useCallback((context: number) => {
		navigate({ to: '/work/roadmap-v2/{-$context}', params: { context: context.toString() } })
			.then();
	}, [navigate]);

	if (context === undefined) {
		return <Navigate to="/work/roadmap-v2/{-$context}" params={{ context: Temporal.Now.plainDateISO().year.toString() }} />
	}

	return <RoadmapV2 context={context} setContext={setContext} />
}
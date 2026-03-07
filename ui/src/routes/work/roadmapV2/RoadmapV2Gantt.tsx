import { Center, Text } from '@mantine/core';
import { useWorkItemsByContextQuery } from '@/api/work-item/work-item-hooks';
import { RoadmapV2GanttSkeleton } from '@/routes/work/roadmapV2/RoadmapV2GanttSkeleton';
import { RoadmapV2EmptySplashScreen } from '@/routes/work/roadmapV2/RoadmapV2EmptySplashScreen';

export function RoadmapV2Gantt({ context }: { context: number }) {
	const workItemsQuery = useWorkItemsByContextQuery(context);

	if (workItemsQuery.isLoading || !workItemsQuery.data) {
		return <RoadmapV2GanttSkeleton />
	}

	if (workItemsQuery.data.length === 0) {
		return <RoadmapV2EmptySplashScreen context={context} />
	}

	return <Center flex={1} bd='1px solid black'>
		<Text>Roadmap V2 Gantt for year {context}</Text>
		<Text>There's {workItemsQuery.data?.length} work items</Text>
	</Center>
}
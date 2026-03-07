import { Menu, Text } from '@mantine/core';
import { useWorkItemsByContextQuery } from '@/api/work-item/work-item-hooks';
import { RoadmapV2GanttSkeleton } from '@/routes/work/roadmapV2/RoadmapV2GanttSkeleton';
import { RoadmapV2EmptySplashScreen } from '@/routes/work/roadmapV2/RoadmapV2EmptySplashScreen';
import { Gantt, GanttItem } from '@/base/gantt';
import { ColumnDescriptor } from '@/base/data-table';
import { WorkItem } from '@/models/WorkItem';
import { useRoadmapGanttItems } from '@/routes/work/roadmapV2/useRoadmapGanttItems';
import { renderRoadmapV2GanttContextMenu } from '@/routes/work/roadmapV2/renderRoadmapV2GanttContextMenu';

export function RoadmapV2Gantt({ context }: { context: number }) {
	const workItemsQuery = useWorkItemsByContextQuery(context);

	const ganttItems = useRoadmapGanttItems(workItemsQuery?.data ?? []);

	if (workItemsQuery.isLoading || !workItemsQuery.data) {
		return <RoadmapV2GanttSkeleton />
	}

	if (workItemsQuery.data.length === 0) {
		return <RoadmapV2EmptySplashScreen context={context} />
	}

	const columns: ColumnDescriptor<GanttItem<WorkItem>>[] = [
		{
			columnId: 'title',
			columnName: 'Title',
			hierarchyColumn: true,
			render: (item) => <Text>{item.data.title}</Text>
		}
	];

	return (
		<Gantt items={ganttItems}
			   containerProps={{ w: '100%', style: { flexGrow: 1, flexShrink: 0 } }}
			   ganttKey={'roadmap-gantt'}
			   possibleColumns={columns}
			   initialColumnIds={['title']}
			   renderContextMenu={(o, s) => renderRoadmapV2GanttContextMenu(o, s, context)}
		/>
	)
}
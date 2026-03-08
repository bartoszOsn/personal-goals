import { useWorkItemsByContextQuery } from '@/api/work-item/work-item-hooks';
import { RoadmapV2GanttSkeleton } from '@/routes/work/roadmapV2/RoadmapV2GanttSkeleton';
import { RoadmapV2EmptySplashScreen } from '@/routes/work/roadmapV2/RoadmapV2EmptySplashScreen';
import { Gantt, GanttItem } from '@/base/gantt';
import { ColumnDescriptor } from '@/base/data-table';
import { WorkItem } from '@/models/WorkItem';
import { useRoadmapGanttItems } from '@/routes/work/roadmapV2/useRoadmapGanttItems';
import { renderRoadmapV2GanttContextMenu } from '@/routes/work/roadmapV2/renderRoadmapV2GanttContextMenu';
import { WorkItemTitleInplace } from '@/core/work-item/inplace/WorkItemTitleInplace';
import { WorkItemStatusInplace } from '@/core/work-item/inplace/WorkItemStatusInplace';
import { WorkItemProgressInplace } from '@/core/work-item/inplace/WorkItemProgressInplace';

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
			render: (item) => <WorkItemTitleInplace workItem={item.data} />
		},
		{
			columnId: 'status',
			columnName: 'Status',
			render: (item) => <WorkItemStatusInplace workItem={item.data} />
		},
		{
			columnId: 'progress',
			columnName: 'Progress',
			render: (item) => <WorkItemProgressInplace workItem={item.data} />
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
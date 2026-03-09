import { useUpdateWorkItemMutation, useWorkItemsByContextQuery } from '@/api/work-item/work-item-hooks';
import { RoadmapV2GanttSkeleton } from '@/routes/work/roadmapV2/RoadmapV2GanttSkeleton';
import { RoadmapV2EmptySplashScreen } from '@/routes/work/roadmapV2/RoadmapV2EmptySplashScreen';
import { Gantt, GanttItem } from '@/base/gantt';
import { ColumnDescriptor } from '@/base/data-table';
import { WorkItem, WorkItemId, WorkItemTimeFrameType } from '@/models/WorkItem';
import { useRoadmapGanttItems } from '@/routes/work/roadmapV2/useRoadmapGanttItems';
import { renderRoadmapV2GanttContextMenu } from '@/routes/work/roadmapV2/renderRoadmapV2GanttContextMenu';
import { WorkItemTitleInplace } from '@/core/work-item/inplace/WorkItemTitleInplace';
import { WorkItemStatusInplace } from '@/core/work-item/inplace/WorkItemStatusInplace';
import { WorkItemProgressInplace } from '@/core/work-item/inplace/WorkItemProgressInplace';
import { WorkItemTimeFrameInplace } from '@/core/work-item/inplace/WorkItemTimeFrameInplace';
import { GanttNewItemDates } from '@/base/gantt/model/GanttNewItemDates';

export function RoadmapV2Gantt({ context }: { context: number }) {
	const workItemsQuery = useWorkItemsByContextQuery(context);
	const updateWorkItemMutation = useUpdateWorkItemMutation();

	const ganttItems = useRoadmapGanttItems(workItemsQuery?.data ?? []);

	const changeDates = (items: Map<string, GanttNewItemDates>) => {
		return Promise.all(
			[...items.entries()].map(([id, newDates]) => {
				return updateWorkItemMutation.mutateAsync({
					id: id as WorkItemId,
					request: {
						timeFrame: {
							type: WorkItemTimeFrameType.CUSTOM_DATE,
							context: context,
							startDate: newDates.startDate,
							endDate: newDates.endDate,
						}
					}
				})
			})
		).then(() => void 0);
	}

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
		},
		{
			columnId: 'timeFrame',
			columnName: 'Time frame',
			render: (item) => <WorkItemTimeFrameInplace workItem={item.data} />
		}
	];

	return (
		<Gantt items={ganttItems}
			   containerProps={{ w: '100%', style: { flexGrow: 1, flexShrink: 0 } }}
			   ganttKey={'roadmap-gantt'}
			   possibleColumns={columns}
			   initialColumnIds={['title']}
			   changeDates={changeDates}
			   renderContextMenu={(o, s) => renderRoadmapV2GanttContextMenu(o, s, context)}
		/>
	)
}
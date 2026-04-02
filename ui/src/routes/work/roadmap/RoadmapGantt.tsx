import { useUpdateWorkItemMutation, useWorkItemsByContextQuery } from '@/api/work-item-old/work-item-hooks';
import { RoadmapGanttSkeleton } from '@/routes/work/roadmap/RoadmapGanttSkeleton';
import { RoadmapEmptySplashScreen } from '@/routes/work/roadmap/RoadmapEmptySplashScreen';
import { Gantt, GanttItem } from '@/base/gantt';
import { ColumnDescriptor } from '@/base/data-table';
import { WorkItemOld, WorkItemId, WorkItemTimeFrameType } from '@/models/WorkItemOld';
import { useRoadmapGanttItems } from '@/routes/work/roadmap/useRoadmapGanttItems';
import { renderRoadmapGanttContextMenu } from '@/routes/work/roadmap/renderRoadmapGanttContextMenu';
import { WorkItemTitleInplace } from '@/core/work-item/inplace/WorkItemTitleInplace';
import { WorkItemStatusInplace } from '@/core/work-item/inplace/WorkItemStatusInplace';
import { WorkItemProgressInplace } from '@/core/work-item/inplace/WorkItemProgressInplace';
import { WorkItemTimeFrameInplace } from '@/core/work-item/inplace/WorkItemTimeFrameInplace';
import { GanttNewItemDates } from '@/base/gantt/model/GanttNewItemDates';
import { Temporal } from 'temporal-polyfill';
import { useSprintQuery } from '@/api/sprint/sprint-hooks';
import { GanttTimebox } from '@/base/gantt/model/GanttTimebox';
import { quarterToColor } from '@/core/quarterToColor';

export function RoadmapGantt({ context, onSelectedWorkItemsChange }: { context: number, onSelectedWorkItemsChange: (workItemIds: WorkItemId[]) => void }) {
	const workItemsQuery = useWorkItemsByContextQuery(context);
	const updateWorkItemMutation = useUpdateWorkItemMutation();

	const sprints = useSprintQuery(context);

	const contextStartDate = Temporal.PlainDate.from({ year: context, month: 1, day: 1 });
	const contextEndDate = Temporal.PlainDate.from({ year: context, month: 12, day: 31 });

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

	if (workItemsQuery.isLoading || !workItemsQuery.data || sprints.isLoading || !sprints.data) {
		return <RoadmapGanttSkeleton />
	}

	if (workItemsQuery.data.length === 0) {
		return <RoadmapEmptySplashScreen context={context} />
	}

	const columns: ColumnDescriptor<GanttItem<WorkItemOld>>[] = [
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

	const timeboxes: GanttTimebox[] = sprints.data.map(sprint => ({
		label: sprint.name,
		startDate: sprint.startDate,
		endDate: sprint.endDate,
		color: quarterToColor[sprint.quarter]
	}));

	return (
		<Gantt items={ganttItems}
			   containerProps={{ w: '100%', style: { flexGrow: 1, flexShrink: 0 } }}
			   ganttKey={'roadmap-gantt'}
			   possibleColumns={columns}
			   initialColumnIds={['title']}
			   changeDates={changeDates}
			   bounds={[contextStartDate, contextEndDate]}
			   timeboxes={timeboxes}
			   setSelectedItemIds={(ids) => onSelectedWorkItemsChange(ids as WorkItemId[])}
			   renderContextMenu={(o, s) => renderRoadmapGanttContextMenu(o, s, context)}
		/>
	)
}
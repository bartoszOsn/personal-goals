import { RoadmapGanttSkeleton } from '@/routes/work/roadmap/RoadmapGanttSkeleton';
import { RoadmapEmptySplashScreen } from '@/routes/work/roadmap/RoadmapEmptySplashScreen';
import { Gantt, GanttItem } from '@/base/gantt';
import { ColumnDescriptor } from '@/base/data-table';
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
import { useMoveWorkItemInHierarchyMutation, useUpdateWorkItemsInHierarchyMutation, useWorkItemHierarchyQuery } from '@/api/work-item/work-item-hooks';
import { WorkItem, WorkItemId, WorkItemMoveOrder, WorkItemTimeFrameType, WorkItemType } from '@/models/WorkItem';

export function RoadmapGantt({ context, onSelectedWorkItemsChange }: { context: number, onSelectedWorkItemsChange: (workItemIds: WorkItemId[]) => void }) {
	const workItemsQuery = useWorkItemHierarchyQuery(context);
	const updateWorkItemMutation = useUpdateWorkItemsInHierarchyMutation();
	const moveWorkItemMutation = useMoveWorkItemInHierarchyMutation()

	const sprints = useSprintQuery(context);

	const contextStartDate = Temporal.PlainDate.from({ year: context, month: 1, day: 1 });
	const contextEndDate = Temporal.PlainDate.from({ year: context, month: 12, day: 31 });

	const ganttItems = useRoadmapGanttItems(workItemsQuery.data?.roots ?? []);

	const changeDates = (items: Map<string, GanttNewItemDates>) => {
		return Promise.all(
			[...items.entries()].map(([id, newDates]) => {
				return updateWorkItemMutation.mutateAsync({
					context: context,
					request: {
						updates: {
							[id as WorkItemId]: {
								timeFrame: {
									type: WorkItemTimeFrameType.CUSTOM_DATE,
									context: context,
									startDate: newDates.startDate,
									endDate: newDates.endDate,
								}
							}
						}
					}
				});
			})
		).then(() => void 0);
	}

	if (workItemsQuery.isLoading || !workItemsQuery.data || sprints.isLoading || !sprints.data) {
		return <RoadmapGanttSkeleton />
	}

	if (workItemsQuery.data.roots.length === 0) {
		return <RoadmapEmptySplashScreen context={context} />
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
			   rowMove={{
				   canBeParent: (_child, parent) => parent.data.data.type !== WorkItemType.TASK,
				   onMove: async (payload) => {
					   let order: WorkItemMoveOrder;

					   if (payload.newOrderInParent[0] === payload.movedRow.id) {
						   order = { type: 'FIRST' }
					   } else if (payload.newOrderInParent.at(-1) === payload.movedRow.id) {
						   order = { type: 'LAST' }
					   } else {
						   const index = payload.newOrderInParent.findIndex(id => id === payload.movedRow.id);
						   order = { type: 'BETWEEN', before: payload.newOrderInParent[index - 1] as WorkItemId, after: payload.newOrderInParent[index + 1] as WorkItemId };
					   }


						await moveWorkItemMutation.mutateAsync({
							context: context,
							request: {
								id: payload.movedRow.data.data.id,
								parentId: payload.newParent?.data.data.id ?? null,
								order: order
							}
						});
				   }
			   }}
			   hideChartWithScreenSmallerThan='sm'
		/>
	)
}
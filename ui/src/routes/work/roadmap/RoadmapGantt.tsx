import { RoadmapGanttSkeleton } from '@/routes/work/roadmap/RoadmapGanttSkeleton';
import { RoadmapEmptySplashScreen } from '@/routes/work/roadmap/RoadmapEmptySplashScreen';
import { useRoadmapGanttItems } from '@/routes/work/roadmap/useRoadmapGanttItems';
import { GanttNewItemDates } from '@/base/gantt/model/GanttNewItemDates';
import { Temporal } from 'temporal-polyfill';
import { useSprintQuery } from '@/api/sprint/sprint-hooks';
import { useMoveWorkItemInHierarchyMutation, useUpdateWorkItemsInHierarchyMutation, useWorkItemHierarchyQuery } from '@/api/work-item/work-item-hooks';
import { WorkItemId, WorkItemTimeFrameType, WorkItemType } from '@/models/WorkItem';
import { Timeline } from '@/base/timeline/api/Timeline';
import { TimelineTimebox } from '@/base/timeline/api/TimelineProps';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/primitive/components/ui/item';
import { CircularProgress } from '@/primitive/components/customized/CircularProgress';
import { WorkItemModalTrigger } from '@/core/work-item/details/WorkItemModalTrigger';
import { InplaceInput } from '@/base/inplace/InplaceInput';
import { Icon } from '@/base/Icon';
import { workItemStatusUIProperties } from '@/core/work-item/workItemStatusUIProperties';
import { WorkItemTimeFrameDisplayRange } from '@/core/work-item/WorkItemTimeFrameDisplayRange';
import { WorkItemTimeFrameDisplayName } from '@/core/work-item/WorkItemTimeFrameDisplayName';

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

	const timeboxes: TimelineTimebox[] = sprints.data.map(sprint => ({
		id: sprint.id,
		name: sprint.name,
		startDate: sprint.startDate,
		endDate: sprint.endDate
	}));

	return (
		<Timeline deepHierarchyItems={ganttItems}
				  startDate={contextStartDate}
				  endDate={contextEndDate}
				  renderCell={(wi) => (
					  <div className="flex flex-row gap-2 flex-nowrap p-1">
						  <Item size="xs" className="p-0 text-nowrap flex-nowrap overflow-hidden">
							  <ItemMedia>
								  <CircularProgress size="default" values={[{
									  value: wi.progress.completed,
									  strokeClass: 'stroke-green-700 dark:stroke-green-400'
								  }, { value: wi.progress.failed, strokeClass: 'stroke-destructive' }]}>
									  <WorkItemModalTrigger context={wi.contextYear} workItem={wi} variant="ghost" size="icon-xs" />
								  </CircularProgress>
							  </ItemMedia>
							  <ItemContent>
								  <ItemTitle className='text-xs'><InplaceInput value={wi.title} /></ItemTitle>
								  <ItemDescription className="flex flex-row gap-1 text-xs">
									  <Icon Icon={workItemStatusUIProperties[wi.status].icon}
											className={workItemStatusUIProperties[wi.status].iconTextClass + ' w-4 h-4'} />
									  {workItemStatusUIProperties[wi.status].label}
								  </ItemDescription>
							  </ItemContent>
						  </Item>
						  <Item size="xs" className="p-0 pl-2 flex-0 text-nowrap" asChild>
							  <button>
								  <ItemContent>
									  <ItemTitle className="w-full justify-end text-xs">
										  <WorkItemTimeFrameDisplayRange workItem={wi} />
									  </ItemTitle>
									  <ItemDescription className="text-end text-xs">
										  <WorkItemTimeFrameDisplayName workItem={wi} />
									  </ItemDescription>
								  </ItemContent>
							  </button>
						  </Item>
					  </div>
				  )}
			   timeboxes={timeboxes}
			  onSelectionChange={onSelectedWorkItemsChange}
				  onMove={() => void 0}
				  canBeParent={(_, parentCandidate) => parentCandidate.type !== WorkItemType.TASK }
		/>
	)
}
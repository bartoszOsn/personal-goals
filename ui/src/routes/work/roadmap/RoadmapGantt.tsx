import { RoadmapGanttSkeleton } from '@/routes/work/roadmap/RoadmapGanttSkeleton';
import { RoadmapEmptySplashScreen } from '@/routes/work/roadmap/RoadmapEmptySplashScreen';
import { useRoadmapGanttItems } from '@/routes/work/roadmap/useRoadmapGanttItems';
import { Temporal } from 'temporal-polyfill';
import { useSprintQuery } from '@/api/sprint/sprint-hooks';
import { useMoveWorkItemInHierarchyMutation, useUpdateWorkItemsInHierarchyMutation, useWorkItemHierarchyQuery } from '@/api/work-item/work-item-hooks';
import { WorkItem, WorkItemId, WorkItemTimeFrameType, WorkItemType } from '@/models/WorkItem';
import { Timeline } from '@/base/timeline/api/Timeline';
import { DeepHierarchyTimelineMovePayload, TimelineTimebox } from '@/base/timeline/api/TimelineProps';
import { RoadmapGanttContextMenu } from '@/routes/work/roadmap/RoadmapGanttContextMenu';
import { RoadmapGanttCell } from '@/routes/work/roadmap/RoadmapGanttCell';

export function RoadmapGantt({ context, selectedWorkItems, onSelectedWorkItemsChange }: { context: number, selectedWorkItems: WorkItemId[], onSelectedWorkItemsChange: (workItemIds: WorkItemId[]) => void }) {
	const workItemsQuery = useWorkItemHierarchyQuery(context);
	const updateWorkItemMutation = useUpdateWorkItemsInHierarchyMutation();
	const moveWorkItemMutation = useMoveWorkItemInHierarchyMutation();

	const sprints = useSprintQuery(context);

	const contextStartDate = Temporal.PlainDate.from({ year: context, month: 1, day: 1 });
	const contextEndDate = Temporal.PlainDate.from({ year: context, month: 12, day: 31 });

	const ganttItems = useRoadmapGanttItems(workItemsQuery.data?.roots ?? []);

	if (workItemsQuery.isLoading || !workItemsQuery.data || sprints.isLoading || !sprints.data) {
		return <RoadmapGanttSkeleton />;
	}

	if (workItemsQuery.data.roots.length === 0) {
		return <RoadmapEmptySplashScreen context={context} />;
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
					  <RoadmapGanttContextMenu clickedOn={wi} selected={selectedWorkItems} context={context}>
						  <RoadmapGanttCell workItem={wi} />
					  </RoadmapGanttContextMenu>
				  )}
				  timeboxes={timeboxes}
				  onSelectionChange={onSelectedWorkItemsChange}
				  onMove={async (movePayload: DeepHierarchyTimelineMovePayload<WorkItemId>) => {
					  const newParent = movePayload.newParentId;
					  const existingParentChildren = getChildren(workItemsQuery.data.roots, newParent)

					  if (movePayload.precedingItemId) {
						  const precedingItemIndex = existingParentChildren.findIndex(child => child.id === movePayload.precedingItemId);
						  if (precedingItemIndex === existingParentChildren.length - 1) {
							  await moveWorkItemMutation.mutateAsync({
								  context: context,
								  request: {
									  id: movePayload.itemId,
									  parentId: newParent,
									  order: {
										  type: 'LAST'
									  }
								  }
							  });
							  return;
						  }

						  await moveWorkItemMutation.mutateAsync({
							  context: context,
							  request: {
								  id: movePayload.itemId,
								  parentId: newParent,
								  order: {
									  type: 'BETWEEN',
									  before: movePayload.precedingItemId,
									  after: existingParentChildren.at(precedingItemIndex + 1)!.id,
								  }
							  }
						  });
						  return;
					  }

					  if (movePayload.succeedingItemId) {
						  const succeedingItemIndex = existingParentChildren.findIndex(child => child.id === movePayload.succeedingItemId);
						  if (succeedingItemIndex === 0) {
							  await moveWorkItemMutation.mutateAsync({
								  context: context,
								  request: {
									  id: movePayload.itemId,
									  parentId: newParent,
									  order: {
										  type: 'FIRST'
									  }
								  }
							  });
							  return;
						  }

						  await moveWorkItemMutation.mutateAsync({
							  context: context,
							  request: {
								  id: movePayload.itemId,
								  parentId: newParent,
								  order: {
									  type: 'BETWEEN',
									  before: existingParentChildren.at(succeedingItemIndex - 1)!.id,
									  after: movePayload.succeedingItemId,
								  }
							  }
						  });
						  return;
					  }

					  await moveWorkItemMutation.mutateAsync({
						  context: context,
						  request: {
							  id: movePayload.itemId,
							  parentId: newParent,
							  order: {
								  type: 'FIRST'
							  }
						  }
					  });
				  }}
				  canBeParent={(_, parentCandidate) => parentCandidate.type !== WorkItemType.TASK}
				  onDatesChange={async (itemId, newDates) => {
					  await updateWorkItemMutation.mutateAsync({
						  context: context,
						  request: {
							  updates: {
								  [itemId]: {
									  timeFrame: {
										  type: WorkItemTimeFrameType.CUSTOM_DATE,
										  context: context,
										  startDate: newDates.from,
										  endDate: newDates.to
									  }
								  }
							  }
						  }
					  });
				  }}
		/>
	);
}

function getChildren(roots: WorkItem[], newParent: WorkItemId | null): WorkItem[] {
	if (newParent === null) {
		return roots;
	}

	const queue = [...roots];

	while (queue.length > 0) {
		const item = queue.shift()!;
		if (item.id === newParent) {
			return item.children;
		}

		queue.push(...item.children);
	}

	return [];
}
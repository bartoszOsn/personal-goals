import { Board } from '@/base/board/api/Board.tsx';
import { SprintId } from '@/models/Sprint.ts';
import { isPlainDate } from '@personal-okr/shared';
import { useSprintQuery } from '@/api/sprint/sprint-hooks.ts';
import {
	useCreateWorkItemInSprintOverviewMutation,
	useMoveWorkItemInSprintOverviewMutation,
	useUpdateWorkItemsInHierarchyMutation,
	useWorkItemSprintOverviewQuery
} from '@/api/work-item/work-item-hooks.ts';
import { WorkItem, WorkItemId, WorkItemMoveOrder, WorkItemStatus, WorkItemType } from '@/models/WorkItem.ts';
import { BoardColumn, BoardItem, BoardReorderResult } from '@/base/board/api/BoardProps.ts';
import { CalendarDays } from 'lucide-react';
import { CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/primitive/components/ui/card.tsx';
import { Button } from '@/primitive/components/ui/button.tsx';
import { Skeleton } from '@/primitive/components/ui/skeleton.tsx';
import { WorkItemModalTrigger } from '@/core/work-item/details/WorkItemModalTrigger.tsx';
import { WorkItemTimeFramePicker } from '@/core/work-item/WorkItemTimeFramePicker.tsx';
import { WorkItemTimeFrameDisplayRange } from '@/core/work-item/WorkItemTimeFrameDisplayRange.tsx';
import { WorkItemTimeFrameDisplayName } from '@/core/work-item/WorkItemTimeFrameDisplayName.tsx';
import { InplaceInput } from '@/base/inplace/InplaceInput.tsx';
import { workItemStatusUIProperties } from '@/core/work-item/workItemStatusUIProperties.ts';
import { Icon } from '@/base/Icon.tsx';

export function SprintOverviewTaskBoard({ context, sprintId }: { context: number, sprintId: SprintId }) {
	const workItems = useWorkItemSprintOverviewQuery(sprintId);
	const sprints = useSprintQuery(context);
	const createWorkItemMutation = useCreateWorkItemInSprintOverviewMutation();
	const moveWorkItemMutation = useMoveWorkItemInSprintOverviewMutation();

	if (workItems.isPending || !workItems.data || sprints.isPending || !sprints.data) {
		return <div className='flex flex-row gap-2'>
			<Skeleton className='h-72' />
			<Skeleton className='h-72' />
			<Skeleton className='h-72' />
		</div>;
	}

	const sprint = sprints.data.find(sprint => sprint.id === sprintId);
	if (!sprint) {
		return <div className='flex flex-row gap-2'>
			<Skeleton className='h-72' />
			<Skeleton className='h-72' />
			<Skeleton className='h-72' />
		</div>;
	}

	const tasksBySprint: BoardItem<WorkItem, WorkItemId, WorkItemStatus>[] = flatWorkItems(workItems.data.tasks)
		.filter(workItem => workItem.type === WorkItemType.TASK)
		.filter(task => task.timeFrame && isPlainDate(task.timeFrame.startDate).afterOrEqual(sprint.startDate) && isPlainDate(task.timeFrame.endDate).beforeOrEqual(sprint.endDate))
		.map(task => ({
			id: task.id,
			data: task,
			columnId: task.status
		}));

	const renderCard = (task: WorkItem) => <SprintOverviewTaskBoardCard task={task} />;

	const onItemMove = async (event: BoardReorderResult<WorkItem, WorkItemId, WorkItemStatus>) => {
		let order: WorkItemMoveOrder;

		if (!event.previousItemId) {
			order = {
				type: 'FIRST'
			};
		} else if (!event.nextItemId) {
			order = {
				type: 'LAST'
			};
		} else {
			order = {
				type: 'BETWEEN',
				after: event.nextItemId,
				before: event.previousItemId
			};
		}


		await moveWorkItemMutation.mutateAsync({
			sprintId: sprintId,
			request: {
				id: event.itemId,
				status: event.toColumnId,
				order
			}
		});
	};

	const onCreateTask = async (status: WorkItemStatus) => {
		await createWorkItemMutation.mutateAsync({
			sprintId: sprintId,
			status: status
		});
	};

	const columns: BoardColumn<WorkItemStatus>[] = [
		{
			columnId: WorkItemStatus.TODO,
			columnHeader: workItemStatusUIProperties[WorkItemStatus.TODO].label,
			columnAction: <Button variant="secondary" onClick={() => onCreateTask(WorkItemStatus.TODO)}>Create</Button>,
			columnIcon: <Icon Icon={workItemStatusUIProperties[WorkItemStatus.TODO].icon}
							  className={workItemStatusUIProperties[WorkItemStatus.TODO].iconTextClass} />
		},
		{
			columnId: WorkItemStatus.IN_PROGRESS,
			columnHeader: workItemStatusUIProperties[WorkItemStatus.IN_PROGRESS].label,
			columnAction: <Button variant="secondary" onClick={() => onCreateTask(WorkItemStatus.IN_PROGRESS)}>Create</Button>,
			columnIcon: <Icon Icon={workItemStatusUIProperties[WorkItemStatus.IN_PROGRESS].icon}
							  className={workItemStatusUIProperties[WorkItemStatus.IN_PROGRESS].iconTextClass} />
		},
		{
			columnId: WorkItemStatus.FAILED,
			columnHeader: workItemStatusUIProperties[WorkItemStatus.FAILED].label,
			columnAction: <Button variant="secondary" onClick={() => onCreateTask(WorkItemStatus.FAILED)}>Create</Button>,
			columnIcon: <Icon Icon={workItemStatusUIProperties[WorkItemStatus.FAILED].icon}
							  className={workItemStatusUIProperties[WorkItemStatus.FAILED].iconTextClass} />
		},
		{
			columnId: WorkItemStatus.DONE,
			columnHeader: workItemStatusUIProperties[WorkItemStatus.DONE].label,
			columnAction: <Button variant="secondary" onClick={() => onCreateTask(WorkItemStatus.DONE)}>Create</Button>,
			columnIcon: <Icon Icon={workItemStatusUIProperties[WorkItemStatus.DONE].icon}
							  className={workItemStatusUIProperties[WorkItemStatus.DONE].iconTextClass} />
		}
	];

	return (
		<Board columns={columns}
			   items={tasksBySprint}
			   renderItemCard={renderCard}
			   onReorder={onItemMove} />
	);
}

function flatWorkItems(workItems: WorkItem[]): WorkItem[] {
	const result: WorkItem[] = [];
	for (const workItem of workItems) {
		result.push(workItem);
		result.push(...flatWorkItems(workItem.children));
	}

	return result;
}

function SprintOverviewTaskBoardCard({ task }: { task: WorkItem }) {
	const updateWorkItemMutation = useUpdateWorkItemsInHierarchyMutation();

	return (
		<>
			<CardHeader>
				<CardTitle>
					<InplaceInput value={task.title} onSubmit={(newTitle) => {
						if (newTitle.trim() === '') {
							return;
						}

						return updateWorkItemMutation.mutateAsync({
							context: task.contextYear,
							request: {
								updates: {
									[task.id]: {
										title: newTitle
									}
								}
							}
						}).then();
					}} />
				</CardTitle>
				<CardDescription className='flex items-center gap-2'><CalendarDays className='w-3 h-3 inline' />
					<WorkItemTimeFrameDisplayName workItem={task} />
				</CardDescription>
				<CardAction>
					<WorkItemModalTrigger context={task.contextYear} workItem={task} variant='ghost' />
				</CardAction>
			</CardHeader>
			<CardContent className="px-2 flex justify-end">
				<WorkItemTimeFramePicker workItem={task}>
					<Button variant="ghost">
						<CalendarDays />
						<WorkItemTimeFrameDisplayRange workItem={task} />
					</Button>
				</WorkItemTimeFramePicker>
			</CardContent>
		</>
	);
}
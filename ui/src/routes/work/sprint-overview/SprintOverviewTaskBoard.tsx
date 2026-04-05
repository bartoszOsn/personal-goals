import { Board } from '@/base/board/api/Board.tsx';
import { BoardColumnDefinition } from '@/base/board/api/BoardColumnDefinition.ts';
import { Group, Skeleton, Space, Stack, Text } from '@mantine/core';
import { SprintId } from '@/models/Sprint';
import { isPlainDate } from '@personal-okr/shared';
import { useSprintQuery } from '@/api/sprint/sprint-hooks';
import { WorkItemTitleInplace } from '@/core/work-item/inplace/WorkItemTitleInplace';
import { WorkItemTimeFrameInplace } from '@/core/work-item/inplace/WorkItemTimeFrameInplace';
import { WorkItemProgressInplace } from '@/core/work-item/inplace/WorkItemProgressInplace';
import {
	useCreateWorkItemInSprintOverviewMutation,
	useMoveWorkItemInSprintOverviewMutation,
	useWorkItemSprintOverviewQuery
} from '@/api/work-item/work-item-hooks';
import { WorkItem, WorkItemMoveOrder, WorkItemStatus, WorkItemType } from '@/models/WorkItem';
import { BoardItemMoveEvent } from '@/base/board';

export function SprintOverviewTaskBoard({ context, sprintId }: { context: number, sprintId: SprintId }) {
	const workItems = useWorkItemSprintOverviewQuery(sprintId);
	const sprints = useSprintQuery(context);
	const createWorkItemMutation = useCreateWorkItemInSprintOverviewMutation();
	const moveWorkItemMutation = useMoveWorkItemInSprintOverviewMutation()
	const columns: BoardColumnDefinition<WorkItemStatus>[] = [
		{
			columnId: WorkItemStatus.TODO,
			name: 'To do',
			color: 'gray'
		},
		{
			columnId: WorkItemStatus.IN_PROGRESS,
			name: 'In progress',
			color: 'blue'
		},
		{
			columnId: WorkItemStatus.FAILED,
			name: 'Failed',
			color: 'red'
		},
		{
			columnId: WorkItemStatus.DONE,
			name: 'Done',
			color: 'green'
		}
	];

	if (workItems.isPending || !workItems.data || sprints.isPending || !sprints.data) {
		return <Group>
			<Skeleton h={300} />
			<Skeleton h={300} />
			<Skeleton h={300} />
		</Group>;
	}

	const sprint = sprints.data.find(sprint => sprint.id === sprintId);
	if (!sprint) {
		return <Group>
			<Skeleton h={300} />
			<Skeleton h={300} />
			<Skeleton h={300} />
		</Group>;
	}

	const tasksBySprint = flatWorkItems(workItems.data.tasks)
		.filter(workItem => workItem.type === WorkItemType.TASK)
		.filter(task => task.timeFrame && isPlainDate(task.timeFrame.startDate).afterOrEqual(sprint.startDate) && isPlainDate(task.timeFrame.endDate).beforeOrEqual(sprint.endDate));

	const renderCard = (task: WorkItem) => {
		return <Stack gap={0}>
			<Space h='md' />
			<WorkItemTitleInplace workItem={task} textProps={{ fw: 'bold' }} />
			<Space h="sm" />
			<Text size="xs" c="dimmed">Time frame</Text>
			<WorkItemTimeFrameInplace workItem={task} multiline />
			<Space h="sm" />
			<Text size="xs" c="dimmed">Progress</Text>
			<WorkItemProgressInplace workItem={task} />
		</Stack>;
	};

	const onItemMove = async (event: BoardItemMoveEvent<WorkItem, WorkItemStatus>) => {
		let order: WorkItemMoveOrder;

		if (event.newIndexInColumn === 0) {
			order = {
				type: 'FIRST'
			};
		} else if (event.newIndexInColumn === event.newColumnItems.length - 1) {
			order = {
				type: 'LAST'
			}
		} else {
			order = {
				type: 'BETWEEN',
				after: event.newColumnItems[event.newIndexInColumn - 1].id,
				before: event.newColumnItems[event.newIndexInColumn + 1].id
			}
		}


		await moveWorkItemMutation.mutateAsync({
			sprintId: sprintId,
			request: {
				id: event.item.id,
				status: event.newColumn.columnId,
				order
			}
		});
	}

	const onCreateTask = async (status: WorkItemStatus) => {
		await createWorkItemMutation.mutateAsync({
			sprintId: sprintId,
			status: status
		});
	};

	return (
		<>
			<Text fw={500}>Tasks</Text>
			<Board columnWidth={300}
				   columns={columns}
				   items={tasksBySprint}
				   itemColumnSelector={(task => task.status)}
				   itemIdSelector={(task) => task.id}
				   renderCard={renderCard}
				   noItemsInColumnText={'No tasks with this status'}
				   onItemMove={onItemMove}
				   onCreateItem={onCreateTask}
				   createButtonText={'Create task'} />
		</>
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
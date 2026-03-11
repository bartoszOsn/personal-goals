import { Board } from '@/base/board/api/Board.tsx';
import { BoardColumn } from '@/base/board/api/BoardColumn.ts';
import { Group, Skeleton, Space, Stack, Text } from '@mantine/core';
import { SprintId } from '@/models/Sprint';
import { useCreateWorkItemMutation, useUpdateWorkItemMutation, useWorkItemsByContextQuery } from '@/api/work-item/work-item-hooks';
import { WorkItem, WorkItemStatus, WorkItemType } from '@/models/WorkItem';
import { isPlainDate } from '@personal-okr/shared';
import { useSprintQuery } from '@/api/sprint/sprint-hooks';
import { WorkItemTitleInplace } from '@/core/work-item/inplace/WorkItemTitleInplace';
import { WorkItemTimeFrameInplace } from '@/core/work-item/inplace/WorkItemTimeFrameInplace';
import { WorkItemProgressInplace } from '@/core/work-item/inplace/WorkItemProgressInplace';

export function SprintOverviewTaskBoard({ context, sprintId }: { context: number, sprintId: SprintId }) {
	const workItems = useWorkItemsByContextQuery(context);
	const sprints = useSprintQuery();
	const updateWorkItem = useUpdateWorkItemMutation();
	const createWorkItemMutation = useCreateWorkItemMutation();
	const columns: BoardColumn<WorkItemStatus>[] = [
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

	const tasksBySprint = flatWorkItems(workItems.data)
		.filter(workItem => workItem.type === WorkItemType.TASK)
		.filter(task => task.timeFrame && isPlainDate(task.timeFrame.startDate).afterOrEqual(sprint.startDate) && isPlainDate(task.timeFrame.endDate).beforeOrEqual(sprint.endDate));

	const renderCard = (task: WorkItem) => {
		return <Stack gap={0}>
			<Space h='md' />
			<WorkItemTitleInplace workItem={task} textProps={{ fw: 'bold' }} />
			<Space h="sm" />
			<Text size="xs" c="dimmed">Time frame</Text>
			<WorkItemTimeFrameInplace workItem={task} />
			<Space h="sm" />
			<Text size="xs" c="dimmed">Progress</Text>
			<WorkItemProgressInplace workItem={task} />
		</Stack>;
	};

	const onColumnChange = async (item: WorkItem, newStatus: WorkItemStatus) => {
		await updateWorkItem.mutateAsync({
			id: item.id,
			request: { status: newStatus }
		});
	};

	const onCreateTask = async (status: WorkItemStatus) => {
		// TODO: set status during creation
		await createWorkItemMutation.mutateAsync({
			context: context,
			type: WorkItemType.TASK
		});
	};

	return (
		<>
			<Text fw={500}>Tasks</Text>
			<Board columnWidth={300}
				   columns={columns}
				   items={tasksBySprint}
				   itemColumnSelector={(task => task.status)}
				   renderCard={renderCard}
				   noItemsInColumnText={'No tasks with this status'}
				   onColumnChange={onColumnChange}
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
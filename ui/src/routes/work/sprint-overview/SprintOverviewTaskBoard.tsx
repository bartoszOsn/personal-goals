import { Board } from '@/base/board/api/Board.tsx';
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
import { WorkItem, WorkItemId, WorkItemMoveOrder, WorkItemStatus, WorkItemType } from '@/models/WorkItem';
import { BoardColumn, BoardItem, BoardReorderResult } from '@/base/board/api/BoardProps';
import { CircleCheck, CircleDashed, CircleDot, CircleX } from 'lucide-react';
import { CardContent } from '@/primitive/components/ui/card';
import { Button } from '@/primitive/components/ui/button';

export function SprintOverviewTaskBoard({ context, sprintId }: { context: number, sprintId: SprintId }) {
	const workItems = useWorkItemSprintOverviewQuery(sprintId);
	const sprints = useSprintQuery(context);
	const createWorkItemMutation = useCreateWorkItemInSprintOverviewMutation();
	const moveWorkItemMutation = useMoveWorkItemInSprintOverviewMutation();

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

	const tasksBySprint: BoardItem<WorkItem, WorkItemId, WorkItemStatus>[] = flatWorkItems(workItems.data.tasks)
		.filter(workItem => workItem.type === WorkItemType.TASK)
		.filter(task => task.timeFrame && isPlainDate(task.timeFrame.startDate).afterOrEqual(sprint.startDate) && isPlainDate(task.timeFrame.endDate).beforeOrEqual(sprint.endDate))
		.map(task => ({
			id: task.id,
			data: task,
			columnId: task.status
		}));

	const renderCard = (task: WorkItem) => {
		return <CardContent>
			<Stack gap={0}>
				<Space h="md" />
				<WorkItemTitleInplace workItem={task} textProps={{ fw: 'bold' }} />
				<Space h="sm" />
				<Text size="xs" c="dimmed">Time frame</Text>
				<WorkItemTimeFrameInplace workItem={task} multiline />
				<Space h="sm" />
				<Text size="xs" c="dimmed">Progress</Text>
				<WorkItemProgressInplace workItem={task} />
			</Stack>
		</CardContent>;
	};

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
				before: event.previousItemId,
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
			columnHeader: 'To do',
			columnAction: <Button variant='secondary' onClick={() => onCreateTask(WorkItemStatus.TODO)}>Create</Button>,
			columnIcon: <CircleDashed className="text-gray-500" />
		},
		{
			columnId: WorkItemStatus.IN_PROGRESS,
			columnHeader: 'In progress',
			columnAction: <Button variant='secondary' onClick={() => onCreateTask(WorkItemStatus.IN_PROGRESS)}>Create</Button>,
			columnIcon: <CircleDot className="text-blue-500" />
		},
		{
			columnId: WorkItemStatus.FAILED,
			columnHeader: 'Failed',
			columnAction: <Button variant='secondary' onClick={() => onCreateTask(WorkItemStatus.FAILED)}>Create</Button>,
			columnIcon: <CircleX className="text-red-500" />
		},
		{
			columnId: WorkItemStatus.DONE,
			columnHeader: 'Done',
			columnAction: <Button variant='secondary' onClick={() => onCreateTask(WorkItemStatus.DONE)}>Create</Button>,
			columnIcon: <CircleCheck className="text-green-500" />
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
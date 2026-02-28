import { Board } from '@/base/board/api/Board.tsx';
import { BoardColumn } from '@/base/board/api/BoardColumn.ts';
import { useCreateTaskMutation, useTasksQuery, useUpdateTaskMutation } from '@/api/task/task-hooks.ts';
import { Group, Skeleton, Space, Stack, Text } from '@mantine/core';
import { TaskNameInplace } from '@/core/task/inplace/TaskNameInplace';
import { TaskStartDateInplace } from '@/core/task/inplace/TaskStartDateInplace';
import { TaskEndDateInplace } from '@/core/task/inplace/TaskEndDateInplace';
import { SprintId } from '@/models/Sprint';
import { Task, TaskStatus } from '@/models/Task';
import { TaskSprintInplace } from '@/core/task/inplace/TaskSprintInplace';
import { TaskKeyResultInplace } from '@/core/task/inplace/TaskKeyResultInplace';

export function SprintOverviewTaskBoard({ sprintId }: { sprintId: SprintId }) {
	const tasksQuery = useTasksQuery();
	const taskUpdateMutation = useUpdateTaskMutation();
	const taskCreateMutation = useCreateTaskMutation();
	const columns: BoardColumn<TaskStatus>[] = [
		{
			columnId: TaskStatus.TODO,
			name: 'To do',
			color: 'gray'
		},
		{
			columnId: TaskStatus.IN_PROGRESS,
			name: 'In progress',
			color: 'blue'
		},
		{
			columnId: TaskStatus.FAILED,
			name: 'Failed',
			color: 'red'
		},
		{
			columnId: TaskStatus.DONE,
			name: 'Done',
			color: 'green'
		}
	];

	if (tasksQuery.isPending || !tasksQuery.data) {
		return <Group>
			<Skeleton h={300} />
			<Skeleton h={300} />
			<Skeleton h={300} />
		</Group>;
	}

	const tasksBySprint = tasksQuery.data.filter(task => task.sprintIds.includes(sprintId));

	const renderCard = (task: Task) => {
		return <Stack gap={0}>
			<Space h='md' />
			<TaskNameInplace task={task} textProps={{ fw: 'bold' }} />
			<Space h="sm" />
			<Group gap='xl' wrap='nowrap'>
				<Stack gap={0}>
					<Text size="xs" c="dimmed">Start date</Text>
					<TaskStartDateInplace task={task} />
				</Stack>
				<Stack gap={0}>
					<Text size="xs" c="dimmed">End date</Text>
					<TaskEndDateInplace task={task} />
				</Stack>
			</Group>
			<Space h="sm" />
			<Text size="xs" c="dimmed">Sprints</Text>
			<TaskSprintInplace task={task} />
			<Space h="sm" />
			<Text size="xs" c="dimmed">Key result</Text>
			<TaskKeyResultInplace task={task} />
		</Stack>;
	};

	const onColumnChange = async (item: Task, newStatus: TaskStatus) => {
		await taskUpdateMutation.mutateAsync({
			id: item.id,
			request: { status: newStatus }
		});
	};

	const onCreateTask = async (status: TaskStatus) => {
		await taskCreateMutation.mutateAsync({
			status: status,
			sprintIds: [sprintId]
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
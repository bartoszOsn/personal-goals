import { Board } from '@/base/board/api/Board.tsx';
import type { BoardColumn } from '@/base/board/api/BoardColumn.ts';
import { type TaskDTO, type TaskStatusDTO } from '@personal-okr/shared';
import { useCreateTaskMutation, useTasksQuery, useUpdateTaskMutation } from '@/api/task-hooks.ts';
import { Group, Skeleton, Space, Stack, Text } from '@mantine/core';
import { DataView, stringDataType } from '@/base/data-type';
import { Temporal } from 'temporal-polyfill';
import { plainDateDataType } from '@/base/data-type/data-types/plainDateDataType';
import { sprintDataType } from '@/core/sprintDataType';
import { keyResultIdDataType } from '@/core/keyResultIdDataType';

export function SprintOverviewTaskBoard({ sprintId }: { sprintId: string }) {
	const tasksQuery = useTasksQuery();
	const taskUpdateMutation = useUpdateTaskMutation();
	const taskCreateMutation = useCreateTaskMutation();
	const columns: BoardColumn<TaskStatusDTO>[] = [
		{
			columnId: 'TODO',
			name: 'To do',
			color: 'gray'
		},
		{
			columnId: 'IN_PROGRESS',
			name: 'In progress',
			color: 'blue'
		},
		{
			columnId: 'FAILED',
			name: 'Failed',
			color: 'red'
		},
		{
			columnId: 'DONE',
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

	const tasksBySprint = tasksQuery.data.tasks.filter(task => task.sprintIds.includes(sprintId));

	const renderCard = (task: TaskDTO) => {
		return <Stack gap={0}>
			<DataView value={task.name}
					  onChange={(newName) => taskUpdateMutation.mutateAsync({ id: task.id, request: { name: newName } }).then()}
					  dataType={stringDataType} />
			<Space h="sm" />
			<Group wrap="nowrap" justify="space-between">
				<Text size="xs" c="dimmed">Start date</Text>
				<Text size="xs" c="dimmed">End date</Text>
			</Group>
			<Group wrap="nowrap" justify="space-between">
				<DataView value={task.startDate ? Temporal.PlainDate.from(task.startDate) : null}
						  onChange={(newDate) => taskUpdateMutation.mutateAsync({
							  id: task.id,
							  request: { startDate: newDate ? { value: newDate.toString() } : undefined }
						  }).then()}
						  dataType={plainDateDataType} />
				<DataView value={task.endDate ? Temporal.PlainDate.from(task.endDate) : null}
						  onChange={(newDate) => taskUpdateMutation.mutateAsync({
							  id: task.id,
							  request: { endDate: newDate ? { value: newDate.toString() } : undefined }
						  }).then()}
						  dataType={plainDateDataType} />
			</Group>
			<Space h="sm" />
			<Text size="xs" c="dimmed">Sprints</Text>
			<DataView value={task.sprintIds}
					  onChange={(newSprintIds) => taskUpdateMutation.mutateAsync({
						  id: task.id,
						  request: { sprintIds: newSprintIds }
					  }).then()}
					  dataType={sprintDataType} />
			<Space h="sm" />
			<Text size="xs" c="dimmed">Key result</Text>
			<DataView value={task.keyResultId}
					  onChange={(newKeyResultId) => taskUpdateMutation.mutateAsync({
						  id: task.id,
						  request: { keyResult: newKeyResultId ? { value: newKeyResultId } : { empty: true } }
					  }).then()}
					  dataType={keyResultIdDataType} />
		</Stack>;
	};

	const onColumnChange = async (item: TaskDTO, newStatus: TaskStatusDTO) => {
		await taskUpdateMutation.mutateAsync({
			id: item.id,
			request: { status: newStatus }
		});
	};

	const onCreateTask = async (status: TaskStatusDTO) => {
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
import { ActionIcon, Button, Group, Stack, Title, Tooltip } from '@mantine/core';
import { IconFileInvoice, IconPlus, IconTrash } from '@tabler/icons-react';
import { useCreateTaskMutation, useDeleteTasksMutation, useTasksQuery, useUpdateTaskMutation } from '@/api/task/task-hooks';
import { DataTable } from '@/base/data-table/api/DataTable';
import { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor';
import { sprintDataType } from '@/core/sprintDataType';
import { useState } from 'react';
import { useDataTableRows } from '@/base/data-table';
import { useTaskModal } from '@/core/task/useTaskModal';
import { TaskNameInplace } from '@/core/task/inplace/TaskNameInplace';
import { TaskStartDateInplace } from '@/core/task/inplace/TaskStartDateInplace';
import { TaskEndDateInplace } from '@/core/task/inplace/TaskEndDateInplace';
import { TaskStatusInplace } from '@/core/task/inplace/TaskStatusInplace';
import { Task } from '@/models/Task';
import { SprintId } from '@/models/Sprint';
import { TaskKeyResultInplace } from '@/core/task/inplace/TaskKeyResultInplace';

export function TasksRoute() {
	const tasksQuery = useTasksQuery();
	const createTaskMutation = useCreateTaskMutation();
	const updateTaskMutation = useUpdateTaskMutation();
	const deleteTaskMutation = useDeleteTasksMutation();
	const openTaskDialog = useTaskModal();
	const [selected, setSelected] = useState<Task[]>([]);

	const onCreate = () => {
		createTaskMutation.mutate({});
	};

	const onDelete = () => {
		deleteTaskMutation.mutate(selected.map(i => i.id));
	};

	const onSelectionChange = (newSelection: Task[]) => {
		const isEqual = newSelection.length === selected.length && newSelection.every((t, i) => t.id === selected[i].id);

		if (!isEqual) {
			setSelected(newSelection);
		}
	};

	const onUpdateSprints = async (task: Task, sprints: SprintId[]) => {
		await updateTaskMutation.mutateAsync({
			id: task.id, request: {
				sprintIds: sprints
			}
		});
	};

	const columns: ColumnDescriptor<Task, any>[] = [
		{
			columnId: 'openTaskModal',
			columnName: 'Open',
			render: (task) => (
				<Tooltip label='Open task'>
					<ActionIcon size='xs' color='gray' onClick={() => openTaskDialog(task.id)}>
						<IconFileInvoice />
					</ActionIcon>
				</Tooltip>
			)
		},
		{
			columnId: 'name',
			columnName: 'Task',
			render: (task) => <TaskNameInplace task={task} />
		},
		{
			columnId: 'status',
			columnName: 'Status',
			render: (task) => <TaskStatusInplace task={task} />
		},
		{
			columnId: 'startDate',
			columnName: 'Start date',
			render: (task) => <TaskStartDateInplace task={task} />
		},
		{
			columnId: 'endDate',
			columnName: 'End date',
			render: (task) => <TaskEndDateInplace task={task} />
		},
		{
			columnId: 'keyResultId',
			columnName: 'Key result',
			render: (task) => <TaskKeyResultInplace task={task} />
		},
		{
			columnId: 'sprints',
			columnName: 'Sprints',
			columnType: sprintDataType,
			select: (task: Task) => task.sprintIds,
			onChange: onUpdateSprints
		}
	];

	const initialColumnIds: string[] = ['name', 'status', 'startDate', 'endDate'];

	const dataTableRows = useDataTableRows({
		rawData: tasksQuery.data ?? [],
		getId: task => task.id,
		getChildren: () => []
	});

	return (
		<Stack w="100%" h="100vh" p="lg">
			<Title>Task list</Title>
			<Group>
				<Button leftSection={<IconPlus />}
						onClick={onCreate}
						loading={createTaskMutation.isPending}>Create</Button>
				<Button leftSection={<IconTrash />}
						color="red"
						onClick={onDelete}
						disabled={selected.length === 0}
						loading={deleteTaskMutation.isPending}>Delete</Button>
			</Group>
			<DataTable rows={dataTableRows}
					   possibleColumns={columns}
					   initialColumnIds={initialColumnIds}
					   tableKey="tasks"
					   tableProps={{ stickyHeader: true }}
					   scrollAreaProps={{ flex: '1' }}
					   onSelectionChange={onSelectionChange}
			/>
		</Stack>
	);
}
import { ActionIcon, Button, Group, Stack, Title, Tooltip } from '@mantine/core';
import { IconFileInvoice, IconPlus, IconTrash } from '@tabler/icons-react';
import { useCreateTaskMutation, useDeleteTasksMutation, useTasksQuery, useUpdateTaskMutation } from '@/api/task-hooks';
import { TaskDTO } from '@personal-okr/shared';
import { DataTable } from '@/base/data-table/api/DataTable';
import { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor';
import { keyResultIdDataType } from '@/core/keyResultIdDataType';
import { sprintDataType } from '@/core/sprintDataType';
import { useState } from 'react';
import { useDataTableRows } from '@/base/data-table';
import { useTaskModal } from '@/core/task/useTaskModal';
import { TaskNameInplace } from '@/core/task/inplace/TaskNameInplace';
import { TaskStartDateInplace } from '@/core/task/inplace/TaskStartDateInplace';
import { TaskEndDateInplace } from '@/core/task/inplace/TaskEndDateInplace';
import { TaskStatusInplace } from '@/core/task/inplace/TaskStatusInplace';

export function TasksRoute() {
	const tasksQuery = useTasksQuery();
	const createTaskMutation = useCreateTaskMutation();
	const updateTaskMutation = useUpdateTaskMutation();
	const deleteTaskMutation = useDeleteTasksMutation();
	const openTaskDialog = useTaskModal();
	const [selected, setSelected] = useState<TaskDTO[]>([]);

	const onCreate = () => {
		createTaskMutation.mutate({});
	};

	const onDelete = () => {
		deleteTaskMutation.mutate(selected.map(i => i.id));
	};

	const onSelectionChange = (newSelection: TaskDTO[]) => {
		const isEqual = newSelection.length === selected.length && newSelection.every((t, i) => t.id === selected[i].id);

		if (!isEqual) {
			setSelected(newSelection);
		}
	};

	const onUpdateKeyResult = async (task: TaskDTO, newKeyResultId: string | undefined) => {
		if (task.keyResultId === newKeyResultId) {
			return;
		}

		await updateTaskMutation.mutateAsync({
			id: task.id, request: {
				keyResult: newKeyResultId === undefined ? { empty: true } : { value: newKeyResultId }
			}
		});
	};

	const onUpdateSprints = async (task: TaskDTO, sprints: string[]) => {
		await updateTaskMutation.mutateAsync({
			id: task.id, request: {
				sprintIds: sprints
			}
		});
	};

	const columns: ColumnDescriptor<TaskDTO, any>[] = [
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
			columnType: keyResultIdDataType,
			select: (task: TaskDTO) => task.keyResultId,
			onChange: onUpdateKeyResult
		},
		{
			columnId: 'sprints',
			columnName: 'Sprints',
			columnType: sprintDataType,
			select: (task: TaskDTO) => task.sprintIds,
			onChange: onUpdateSprints
		}
	];

	const initialColumnIds: string[] = ['name', 'status', 'startDate', 'endDate'];

	const dataTableRows = useDataTableRows({
		rawData: tasksQuery.data?.tasks ?? [],
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
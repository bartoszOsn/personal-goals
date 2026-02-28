import { ActionIcon, Button, Group, Stack, Title, Tooltip } from '@mantine/core';
import { IconFileInvoice, IconPlus, IconTrash } from '@tabler/icons-react';
import { useCreateTaskMutation, useDeleteTasksMutation, useTasksQuery, useUpdateTaskMutation } from '@/api/task-hooks';
import { stringDataType } from '@/base/data-type';
import { TaskDTO, TaskStatusDTO } from '@personal-okr/shared';
import { taskStatusDataType } from '@/core/taskStatusDataType';
import { Temporal } from 'temporal-polyfill';
import { plainDateDataType } from '@/base/data-type/data-types/plainDateDataType';
import { DataTable } from '@/base/data-table/api/DataTable';
import { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor';
import { keyResultIdDataType } from '@/core/keyResultIdDataType';
import { sprintDataType } from '@/core/sprintDataType';
import { useState } from 'react';
import { useDataTableRows } from '@/base/data-table';
import { useTaskModal } from '@/core/task/useTaskModal';

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

	const onUpdateName = async (task: TaskDTO, newName: string) => {
		if (task.name === newName) {
			return;
		}

		await updateTaskMutation.mutateAsync({
			id: task.id, request: { name: newName }
		});
	};

	const onUpdateStatus = async (task: TaskDTO, newStatus: TaskStatusDTO) => {
		if (task.status === newStatus) {
			return;
		}

		await updateTaskMutation.mutateAsync({
			id: task.id, request: { status: newStatus }
		});
	};

	const onUpdateStartDate = async (task: TaskDTO, newDate: Temporal.PlainDate | null) => {
		if ((task.startDate ?? null) === newDate?.toString()) {
			return;
		}

		await updateTaskMutation.mutateAsync({
			id: task.id, request: {
				startDate: newDate === null ? { empty: true } : { value: newDate.toString() }
			}
		});
	};

	const onUpdateEndDate = async (task: TaskDTO, newDate: Temporal.PlainDate | null) => {
		if ((task.endDate ?? null) === newDate?.toString()) {
			return;
		}

		await updateTaskMutation.mutateAsync({
			id: task.id, request: {
				endDate: newDate === null ? { empty: true } : { value: newDate.toString() }
			}
		});
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
			columnType: {
				Presenter: ({ value: task }) => (
					<Tooltip label='Open task'>
						<ActionIcon size='xs' color='gray' onClick={() => openTaskDialog(task.id)}>
							<IconFileInvoice />
						</ActionIcon>
					</Tooltip>
				),
				Editor: () => { throw new Error('Not implemented') }
			},
			select: (task: TaskDTO) => task,
		},
		{
			columnId: 'name',
			columnName: 'Task',
			columnType: stringDataType,
			select: (task: TaskDTO) => task.name,
			onChange: onUpdateName
		},
		{
			columnId: 'status',
			columnName: 'Status',
			columnType: taskStatusDataType,
			select: (task: TaskDTO) => task.status,
			onChange: onUpdateStatus
		},
		{
			columnId: 'startDate',
			columnName: 'Start date',
			columnType: plainDateDataType,
			select: (task: TaskDTO) => !task.startDate ? null : Temporal.PlainDate.from(task.startDate),
			onChange: onUpdateStartDate
		},
		{
			columnId: 'endDate',
			columnName: 'End date',
			columnType: plainDateDataType,
			select: (task: TaskDTO) => !task.endDate ? null : Temporal.PlainDate.from(task.endDate),
			onChange: onUpdateEndDate
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
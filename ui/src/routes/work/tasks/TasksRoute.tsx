import { Button, Group, Stack, Title } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useCreateTaskMutation, useDeleteTasksMutation, useTasksQuery } from '@/api/task/task-hooks';
import { DataTable } from '@/base/data-table/api/DataTable';
import { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor';
import { useMemo, useState } from 'react';
import { useDataTableRows } from '@/base/data-table';
import { Task } from '@/models/Task';
import { WorkItemTaskVariant, WorkItemVariant } from '@/models/WorkItemVariant';
import { taskColumns, workItemCommonColumns } from '@/core/columns';

export function TasksRoute() {
	const tasksQuery = useTasksQuery();
	const createTaskMutation = useCreateTaskMutation();
	const deleteTaskMutation = useDeleteTasksMutation();
	const [selected, setSelected] = useState<Task[]>([]);

	const onCreate = () => {
		createTaskMutation.mutate({});
	};

	const onDelete = () => {
		deleteTaskMutation.mutate(selected.map(i => i.id));
	};

	const onSelectionChange = (newSelection: WorkItemTaskVariant[]) => {
		const isEqual = newSelection.length === selected.length && newSelection.every((t, i) => t.task.id === selected[i].id);

		if (!isEqual) {
			setSelected(newSelection.map(task => task.task));
		}
	};

	const columns: ColumnDescriptor<WorkItemVariant>[] = useMemo(
		() => [...workItemCommonColumns, ...taskColumns],
		[]
	);

	const initialColumnIds: string[] = ['name', 'status', 'startDate', 'endDate'];

	const dataTableRows = useDataTableRows({
		rawData: tasksQuery.data?.map(task => ({ task}) as WorkItemTaskVariant) ?? [],
		getId: task => task.task.id,
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
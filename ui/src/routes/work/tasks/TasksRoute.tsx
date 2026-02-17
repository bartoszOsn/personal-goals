import { Button, Group, rem, Stack, Table, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useCreateTaskMutation, useTasksQuery, useUpdateTaskMutation } from '@/api/task-hooks';
import { DataView, stringDataType } from '@/base/data-type';
import type { TaskDTO } from '@personal-okr/shared';

export function TasksRoute() {
	const tasksQuery = useTasksQuery();
	const createTaskMutation = useCreateTaskMutation();
	const updateTaskMutation = useUpdateTaskMutation();

	const onCreate = () => {
		createTaskMutation.mutate({});
	};

	const onUpdateName = (task: TaskDTO, newName: string) => {
		updateTaskMutation.mutate({
			id: task.id, request: { name: newName }
		});
	};

	return (
		<Stack w="100%" h="100vh" p="lg">
			<Title>Task list</Title>
			<Group>
				<Button leftSection={<IconPlus />} onClick={onCreate}>Create</Button>
			</Group>
			<Table.ScrollContainer flex="1" minWidth={rem(300)}>
				<Table stickyHeader>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Task</Table.Th>
							<Table.Th>Status</Table.Th>
							<Table.Th>Start</Table.Th>
							<Table.Th>End</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{
							tasksQuery.data?.tasks.map((task) => (
								<Table.Tr>
									<Table.Td>
										<DataView value={task.name}
												  onChange={(newName) => onUpdateName(task, newName)}
												  dataType={stringDataType} />
									</Table.Td>
									<Table.Td>{task.status}</Table.Td>
									<Table.Td>{task.startDate}</Table.Td>
									<Table.Td>{task.endDate}</Table.Td>
								</Table.Tr>
							))
						}
					</Table.Tbody>
				</Table>
			</Table.ScrollContainer>
		</Stack>
	);
}
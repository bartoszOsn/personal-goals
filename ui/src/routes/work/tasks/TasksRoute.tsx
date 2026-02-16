import { Button, Group, rem, Stack, Table, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useCreateTaskMutation, useTasksQuery } from '@/api/task-hooks';
import { DataView, stringDataType } from '@/base/data-type';

export function TasksRoute() {
	const tasksQuery = useTasksQuery();
	const createTaskMutation = useCreateTaskMutation();

	const onCreate = () => {
		createTaskMutation.mutate({
			name: 'New task',
			status: 'TODO',
			description: '',
			dates: null,
			sprintIds: []
		})
	}

	return (
		<Stack w='100%' h='100vh' p="lg">
			<Title>Task list</Title>
			<Group>
				<Button leftSection={<IconPlus />} onClick={onCreate}>Create</Button>
			</Group>
			<Table.ScrollContainer flex='1' minWidth={rem(300)}>
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
										<DataView value={task.name} onChange={() => {}} dataType={stringDataType} />
									</Table.Td>
									<Table.Td>{task.status}</Table.Td>
									<Table.Td>{task.dates?.start}</Table.Td>
									<Table.Td>{task.dates?.end}</Table.Td>
								</Table.Tr>
							))
						}
					</Table.Tbody>
				</Table>
			</Table.ScrollContainer>
		</Stack>
	)
}
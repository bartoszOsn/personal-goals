import { Button, Group, rem, Stack, Table, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useCreateTaskMutation, useTasksQuery, useUpdateTaskMutation } from '@/api/task-hooks';
import { DataView, stringDataType } from '@/base/data-type';
import type { TaskDTO, TaskStatusDTO } from '@personal-okr/shared';
import { taskStatusDataType } from '@/core/taskStatusDataType';
import { Temporal } from 'temporal-polyfill';
import { plainDateDataType } from '@/base/data-type/data-types/plainDateDataType';

export function TasksRoute() {
	const tasksQuery = useTasksQuery();
	const createTaskMutation = useCreateTaskMutation();
	const updateTaskMutation = useUpdateTaskMutation();

	const onCreate = () => {
		createTaskMutation.mutate({});
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
	}

	const onUpdateStartDate = async (task: TaskDTO, newDate: Temporal.PlainDate | null) => {
		if ((task.startDate ?? null) === newDate?.toString()) {
			return;
		}

		await updateTaskMutation.mutateAsync({
			id: task.id, request: {
				startDate: newDate === null ? { empty: true} : { value: newDate.toString() }
			}
		});
	}

	const onUpdateEndDate = async (task: TaskDTO, newDate: Temporal.PlainDate | null) => {
		if ((task.endDate ?? null) === newDate?.toString()) {
			return;
		}

		await updateTaskMutation.mutateAsync({
			id: task.id, request: {
				endDate: newDate === null ? { empty: true} : { value: newDate.toString() }
			}
		});
	}

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
									<Table.Td>
										<DataView value={task.status}
												  onChange={(newStatus) => onUpdateStatus(task, newStatus)}
												  dataType={taskStatusDataType} />
									</Table.Td>
									<Table.Td>
										<DataView value={task.startDate ? Temporal.PlainDate.from(task.startDate) : null}
												  onChange={(newDate) => onUpdateStartDate(task, newDate)}
												  dataType={plainDateDataType} />
									</Table.Td>
									<Table.Td>
										<DataView value={task.endDate ? Temporal.PlainDate.from(task.endDate) : null}
												  onChange={(newDate) => onUpdateEndDate(task, newDate)}
												  dataType={plainDateDataType} />
									</Table.Td>
								</Table.Tr>
							))
						}
					</Table.Tbody>
				</Table>
			</Table.ScrollContainer>
		</Stack>
	);
}
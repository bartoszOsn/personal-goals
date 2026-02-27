import { Group, Modal, Stack, Text } from '@mantine/core';
import { useTaskQuery, useUpdateTaskMutation } from '@/api/task-hooks.ts';
import { TaskModalSkeleton } from '@/core/task/TaskModalSkeleton.tsx';
import { DataView, stringDataType } from '@/base/data-type';
import { plainDateDataType } from '@/base/data-type/data-types/plainDateDataType';
import { Temporal } from 'temporal-polyfill';
import { taskStatusDataType } from '@/core/taskStatusDataType';
import { type TaskStatusDTO } from '@personal-okr/shared';
import { sprintDataType } from '@/core/sprintDataType';
import { keyResultIdDataType } from '@/core/keyResultIdDataType';
import { RichTextEditor } from '@/base/rich-text/RichTextEditor';

export function TaskModal({ taskId }: { taskId: string }) {
	const taskQuery = useTaskQuery(taskId);
	const updateTaskMutation = useUpdateTaskMutation();

	const onChangeTaskName = async (newName: string) => {
		await updateTaskMutation.mutateAsync({
			id: taskId,
			request: {
				name: newName
			}
		});
	};

	const onStartDateChange = async (newDate: Temporal.PlainDate | null) => {
		await updateTaskMutation.mutateAsync({
			id: taskId,
			request: {
				startDate: newDate ? { value: newDate.toString() } : { empty: true }
			}
		});
	};

	const onEndDateChange = async (newDate: Temporal.PlainDate | null) => {
		await updateTaskMutation.mutateAsync({
			id: taskId,
			request: {
				endDate: newDate ? { value: newDate.toString() } : { empty: true }
			}
		});
	};

	const onStatusChange = async (newStatus: TaskStatusDTO) => {
		await updateTaskMutation.mutateAsync({
			id: taskId,
			request: {
				status: newStatus
			}
		});
	};

	const onSprintChange = async (newSprintIds: string[]) => {
		await updateTaskMutation.mutateAsync({
			id: taskId,
			request: {
				sprintIds: newSprintIds
			}
		});
	};

	const onKeyResultChange = async (newKeyResultId: string | undefined) => {
		await updateTaskMutation.mutateAsync({
			id: taskId,
			request: {
				keyResult: newKeyResultId === undefined ? { empty: true } : { value: newKeyResultId }
			}
		});
	};

	const onChangeTaskDescription = async (newDescription: string) => {
		await updateTaskMutation.mutateAsync({
			id: taskId,
			request: {
				description: newDescription
			}
		})
	}

	if (taskQuery.isPending || !taskQuery.data) {
		return <TaskModalSkeleton />;
	}

	return (
		<>
			<Modal.Header>
				<Modal.Title>
					<Text size="lg">
						<DataView value={taskQuery.data.name} dataType={stringDataType} onChange={onChangeTaskName} />
					</Text>
				</Modal.Title>
				<Modal.CloseButton />
			</Modal.Header>
			<Modal.Body>
				<Stack gap='xl'>
					<Group gap='xl' align='flex-start'>
						<Stack gap="xs">
							<Text size="sm" c="dimmed">Start date</Text>
							<DataView value={taskQuery.data.startDate ? Temporal.PlainDate.from(taskQuery.data.startDate) : null}
									  dataType={plainDateDataType}
									  onChange={onStartDateChange} />
						</Stack>
						<Stack gap="xs">
							<Text size="sm" c="dimmed">End date</Text>
							<DataView value={taskQuery.data.endDate ? Temporal.PlainDate.from(taskQuery.data.endDate) : null}
									  dataType={plainDateDataType}
									  onChange={onEndDateChange} />
						</Stack>
						<Stack gap="xs">
							<Text size="sm" c="dimmed">Status</Text>
							<DataView value={taskQuery.data.status}
									  dataType={taskStatusDataType}
									  onChange={onStatusChange} />
						</Stack>
						<Stack gap="xs">
							<Text size="sm" c="dimmed">Sprints</Text>
							<DataView value={taskQuery.data.sprintIds}
									  dataType={sprintDataType}
									  onChange={onSprintChange} />
						</Stack>
						<Stack gap="xs">
							<Text size="sm" c="dimmed">Key Result</Text>
							<DataView value={taskQuery.data.keyResultId}
									  dataType={keyResultIdDataType}
									  onChange={onKeyResultChange} />
						</Stack>
					</Group>
					<RichTextEditor content={taskQuery.data.description}
									placeholder='Description'
									onChangeThrottle={onChangeTaskDescription} />
				</Stack>
			</Modal.Body>
		</>
	);
}
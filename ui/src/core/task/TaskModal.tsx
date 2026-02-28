import { Group, Modal, Stack, Text } from '@mantine/core';
import { useTaskQuery, useUpdateTaskMutation } from '@/api/task/task-hooks.ts';
import { TaskModalSkeleton } from '@/core/task/TaskModalSkeleton.tsx';
import { DataView, stringDataType } from '@/base/data-type';
import { plainDateDataType } from '@/base/data-type/data-types/plainDateDataType';
import { Temporal } from 'temporal-polyfill';
import { taskStatusDataType } from '@/core/taskStatusDataType';
import { sprintDataType } from '@/core/sprintDataType';
import { keyResultIdDataType } from '@/core/keyResultIdDataType';
import { RichTextEditor } from '@/base/rich-text/RichTextEditor';
import { TaskId, TaskStatus } from '@/models/Task';
import { SprintId } from '@/models/Sprint';
import { KeyResultId } from '@/models/KeyResult';

export function TaskModal({ taskId }: { taskId: TaskId }) {
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
				startDate: newDate
			}
		});
	};

	const onEndDateChange = async (newDate: Temporal.PlainDate | null) => {
		await updateTaskMutation.mutateAsync({
			id: taskId,
			request: {
				endDate: newDate
			}
		});
	};

	const onStatusChange = async (newStatus: TaskStatus) => {
		await updateTaskMutation.mutateAsync({
			id: taskId,
			request: {
				status: newStatus
			}
		});
	};

	const onSprintChange = async (newSprintIds: SprintId[]) => {
		await updateTaskMutation.mutateAsync({
			id: taskId,
			request: {
				sprintIds: newSprintIds
			}
		});
	};

	const onKeyResultChange = async (newKeyResultId: KeyResultId | null) => {
		await updateTaskMutation.mutateAsync({
			id: taskId,
			request: {
				keyResultId: newKeyResultId
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
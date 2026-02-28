import { Group, Modal, Stack, Text } from '@mantine/core';
import { useTaskQuery, useUpdateTaskMutation } from '@/api/task/task-hooks.ts';
import { TaskModalSkeleton } from '@/core/task/TaskModalSkeleton.tsx';
import { RichTextEditor } from '@/base/rich-text/RichTextEditor';
import { TaskId } from '@/models/Task';
import { TaskNameInplace } from '@/core/task/inplace/TaskNameInplace';
import { TaskStartDateInplace } from '@/core/task/inplace/TaskStartDateInplace';
import { TaskEndDateInplace } from '@/core/task/inplace/TaskEndDateInplace';
import { TaskStatusInplace } from '@/core/task/inplace/TaskStatusInplace';
import { TaskSprintInplace } from '@/core/task/inplace/TaskSprintInplace';
import { TaskKeyResultInplace } from '@/core/task/inplace/TaskKeyResultInplace';

export function TaskModal({ taskId }: { taskId: TaskId }) {
	const taskQuery = useTaskQuery(taskId);
	const updateTaskMutation = useUpdateTaskMutation();

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
					<TaskNameInplace task={taskQuery.data} textProps={{ inherit: false, size: 'xl'}} />
				</Modal.Title>
				<Modal.CloseButton />
			</Modal.Header>
			<Modal.Body>
				<Stack gap='xl'>
					<Group gap='xl' align='flex-start'>
						<Stack gap="xs">
							<Text size="sm" c="dimmed">Start date</Text>
							<TaskStartDateInplace task={taskQuery.data} />
						</Stack>
						<Stack gap="xs">
							<Text size="sm" c="dimmed">End date</Text>
							<TaskEndDateInplace task={taskQuery.data} />
						</Stack>
						<Stack gap="xs">
							<Text size="sm" c="dimmed">Status</Text>
							<TaskStatusInplace task={taskQuery.data} />
						</Stack>
						<Stack gap="xs">
							<Text size="sm" c="dimmed">Sprints</Text>
							<TaskSprintInplace task={taskQuery.data} />
						</Stack>
						<Stack gap="xs">
							<Text size="sm" c="dimmed">Key Result</Text>
							<TaskKeyResultInplace task={taskQuery.data} />
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
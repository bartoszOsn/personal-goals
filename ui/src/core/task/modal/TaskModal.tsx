import { Group, Modal, Stack, Text } from '@mantine/core';
import { useTaskQuery, useUpdateTaskMutation } from '@/api/task/task-hooks.ts';
import { WorkItemModalSkeleton } from '@/core/WorkItemModalSkeleton.tsx';
import { RichTextEditor } from '@/base/rich-text/RichTextEditor.tsx';
import { TaskId } from '@/models/Task.ts';
import { TaskNameInplace } from '@/core/task/inplace/TaskNameInplace.tsx';
import { TaskStartDateInplace } from '@/core/task/inplace/TaskStartDateInplace.tsx';
import { TaskEndDateInplace } from '@/core/task/inplace/TaskEndDateInplace.tsx';
import { TaskStatusInplace } from '@/core/task/inplace/TaskStatusInplace.tsx';
import { TaskSprintInplace } from '@/core/task/inplace/TaskSprintInplace.tsx';
import { TaskKeyResultInplace } from '@/core/task/inplace/TaskKeyResultInplace.tsx';

export function TaskModal({ taskId }: { taskId: TaskId }) {
	const taskQuery = useTaskQuery(taskId);
	const updateTaskMutation = useUpdateTaskMutation();

	const onChangeTaskDescription = async (newDescription: string) => {
		await updateTaskMutation.mutateAsync({
			id: taskId,
			request: {
				description: newDescription
			}
		});
	};

	if (taskQuery.isPending || !taskQuery.data) {
		return <WorkItemModalSkeleton />;
	}

	return (
		<>
			<Modal.Header style={{ gap: 'var(--mantine-spacing-md)'}}>
				<Modal.Title flex={1}>
					<TaskNameInplace task={taskQuery.data}
									 textProps={{ inherit: false, size: 'xl' }}
									 inputProps={{ w: '100%' }} showDialogButton={false} />
				</Modal.Title>
				<Modal.CloseButton />
			</Modal.Header>
			<Modal.Body>
				<Stack gap="xl">
					<Group gap="xl" align="flex-start">
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
									placeholder="Description"
									onChangeThrottle={onChangeTaskDescription} />
				</Stack>
			</Modal.Body>
		</>
	);
}
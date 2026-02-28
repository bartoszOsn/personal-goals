import { ComponentProps } from 'react';
import { InplaceBadgeDisplay } from '@/base/inplace-editor/api/primitive/display/InplaceBadgeDisplay.tsx';
import { InplaceSelectEdit } from '@/base/inplace-editor/api/primitive/edit/InplaceSelectEdit.tsx';
import { useUpdateTaskMutation } from '@/api/task/task-hooks.ts';
import { InplaceEditorDisplay } from '@/base/inplace-editor/api/InplaceEditorDisplay.tsx';
import { InplaceEditorEdit } from '@/base/inplace-editor/api/InplaceEditorEdit.tsx';
import { InplaceEditor } from '@/base/inplace-editor/api/InplaceEditor.tsx';
import { ComboboxData, MantineColor } from '@mantine/core';
import { Task, TaskStatus } from '@/models/Task';

export interface TaskStatusInplaceProps {
	task: Task;
	badgeProps?: ComponentProps<typeof InplaceBadgeDisplay>
	selectProps?: ComponentProps<typeof InplaceSelectEdit>;
}

export function TaskStatusInplace({ task, badgeProps, selectProps}: TaskStatusInplaceProps) {
	const taskMutation = useUpdateTaskMutation();

	const onValueSubmit = (value: TaskStatus) => {
		taskMutation.mutate({
			id: task.id,
			request: {
				status: value,
			}
		});
	}

	const options: ComboboxData = Object.entries(statusToName).map(([value, label]) => ({ value, label }));

	return (
		<InplaceEditor loading={taskMutation.isPending}>
			<InplaceEditorDisplay>
				<InplaceBadgeDisplay color={statusToColor[task.status]} {...badgeProps}>{statusToName[task.status]}</InplaceBadgeDisplay>
			</InplaceEditorDisplay>
			<InplaceEditorEdit>
				<InplaceSelectEdit defaultValue={task.status}
								   data={options}
								   onValueSubmit={(value) => value && onValueSubmit(value as TaskStatus)}
								   {...selectProps} />
			</InplaceEditorEdit>
		</InplaceEditor>
	)
}

const statusToName: Record<TaskStatus, string> = {
	[TaskStatus.TODO]: 'To Do',
	[TaskStatus.IN_PROGRESS]: 'In Progress',
	[TaskStatus.DONE]: 'Done',
	[TaskStatus.FAILED]: 'Failed'
};

const statusToColor: Record<TaskStatus, MantineColor> = {
	[TaskStatus.TODO]: 'gray',
	[TaskStatus.IN_PROGRESS]: 'blue',
	[TaskStatus.DONE]: 'green',
	[TaskStatus.FAILED]: 'red'
};
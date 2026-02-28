import { TaskDTO, TaskStatusDTO } from '@personal-okr/shared';
import { ComponentProps } from 'react';
import { InplaceBadgeDisplay } from '@/base/inplace-editor/api/primitive/display/InplaceBadgeDisplay.tsx';
import { InplaceSelectEdit } from '@/base/inplace-editor/api/primitive/edit/InplaceSelectEdit.tsx';
import { useUpdateTaskMutation } from '@/api/task-hooks.ts';
import { InplaceEditorDisplay } from '@/base/inplace-editor/api/InplaceEditorDisplay.tsx';
import { InplaceEditorEdit } from '@/base/inplace-editor/api/InplaceEditorEdit.tsx';
import { InplaceEditor } from '@/base/inplace-editor/api/InplaceEditor.tsx';
import { ComboboxData, MantineColor } from '@mantine/core';

export interface TaskStatusInplaceProps {
	task: TaskDTO;
	badgeProps?: ComponentProps<typeof InplaceBadgeDisplay>
	selectProps?: ComponentProps<typeof InplaceSelectEdit>;
}

export function TaskStatusInplace({ task, badgeProps, selectProps}: TaskStatusInplaceProps) {
	const taskMutation = useUpdateTaskMutation();

	const onValueSubmit = (value: TaskStatusDTO) => {
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
								   onValueSubmit={(value) => value && onValueSubmit(value as TaskStatusDTO)}
								   {...selectProps} />
			</InplaceEditorEdit>
		</InplaceEditor>
	)
}

const statusToName: Record<TaskStatusDTO, string> = {
	TODO: 'To Do',
	IN_PROGRESS: 'In Progress',
	DONE: 'Done',
	FAILED: 'Failed'
};

const statusToColor: Record<TaskStatusDTO, MantineColor> = {
	TODO: 'gray',
	IN_PROGRESS: 'blue',
	DONE: 'green',
	FAILED: 'red'
};
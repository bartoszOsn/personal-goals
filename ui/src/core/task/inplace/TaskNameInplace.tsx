import { TaskDTO } from '@personal-okr/shared';
import { useUpdateTaskMutation } from '@/api/task-hooks.ts';
import { InplaceEditor } from '@/base/inplace-editor/api/InplaceEditor.tsx';
import { InplaceEditorDisplay } from '@/base/inplace-editor/api/InplaceEditorDisplay.tsx';
import { InplaceTextDisplay } from '@/base/inplace-editor/api/primitive/display/InplaceTextDisplay.tsx';
import { InplaceEditorEdit } from '@/base/inplace-editor/api/InplaceEditorEdit.tsx';
import { InplaceTextInputEdit } from '@/base/inplace-editor/api/primitive/edit/InplaceTextInputEdit.tsx';
import { ComponentProps } from 'react';

export interface TaskNameInplaceProps {
	task: TaskDTO;
	textProps?: ComponentProps<typeof InplaceTextDisplay>
	inputProps?: ComponentProps<typeof InplaceTextInputEdit>;
}

export function TaskNameInplace({ task, textProps, inputProps }: TaskNameInplaceProps) {
	const taskMutation = useUpdateTaskMutation();

	const onValueSubmit = (value: string) => {
		taskMutation.mutate({
			id: task.id,
			request: {
				name: value,
			}
		});
	}

	return (
		<InplaceEditor loading={taskMutation.isPending}>
			<InplaceEditorDisplay>
				<InplaceTextDisplay {...textProps}>{task.name}</InplaceTextDisplay>
			</InplaceEditorDisplay>
			<InplaceEditorEdit>
				<InplaceTextInputEdit {...inputProps} defaultValue={task.name} onValueSubmit={onValueSubmit} />
			</InplaceEditorEdit>
		</InplaceEditor>
	)
}
import { TaskDTO } from '@personal-okr/shared';
import { useUpdateTaskMutation } from '@/api/task-hooks.ts';
import { InplaceEditor } from '@/base/inplace-editor/api/InplaceEditor.tsx';
import { InplaceEditorDisplay } from '@/base/inplace-editor/api/InplaceEditorDisplay.tsx';
import { InplaceTextDisplay } from '@/base/inplace-editor/api/primitive/display/InplaceTextDisplay.tsx';
import { InplaceEditorEdit } from '@/base/inplace-editor/api/InplaceEditorEdit.tsx';
import { ComponentProps } from 'react';
import { InplacePlainDateEdit } from '@/base/inplace-editor/api/primitive/edit/InplacePlainDateEdit.tsx';
import { Temporal } from 'temporal-polyfill';

export interface TaskStartDateInplaceProps {
	task: TaskDTO;
	textProps?: ComponentProps<typeof InplaceTextDisplay>
	inputProps?: ComponentProps<typeof InplacePlainDateEdit>;
}

export function TaskStartDateInplace({ task, textProps, inputProps }: TaskStartDateInplaceProps) {
	const taskMutation = useUpdateTaskMutation();

	const onValueSubmit = (value: Temporal.PlainDate | null) => {
		taskMutation.mutate({
			id: task.id,
			request: {
				startDate: value === null ? { empty: true } : { value: value.toString() }
			}
		});
	}

	return (
		<InplaceEditor loading={taskMutation.isPending}>
			<InplaceEditorDisplay>
				{
					task.startDate
					? <InplaceTextDisplay {...textProps}>{task.startDate}</InplaceTextDisplay>
						: <InplaceTextDisplay c='dimmed' {...textProps}>No date</InplaceTextDisplay>
				}

			</InplaceEditorDisplay>
			<InplaceEditorEdit>
				<InplacePlainDateEdit {...inputProps} defaultValue={task.startDate} onValueSubmit={onValueSubmit} />
			</InplaceEditorEdit>
		</InplaceEditor>
	)
}
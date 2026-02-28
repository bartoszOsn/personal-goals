import { useUpdateTaskMutation } from '@/api/task/task-hooks.ts';
import { InplaceEditor } from '@/base/inplace-editor/api/InplaceEditor.tsx';
import { InplaceEditorDisplay } from '@/base/inplace-editor/api/InplaceEditorDisplay.tsx';
import { InplaceTextDisplay } from '@/base/inplace-editor/api/primitive/display/InplaceTextDisplay.tsx';
import { InplaceEditorEdit } from '@/base/inplace-editor/api/InplaceEditorEdit.tsx';
import { ComponentProps } from 'react';
import { InplacePlainDateEdit } from '@/base/inplace-editor/api/primitive/edit/InplacePlainDateEdit.tsx';
import { Temporal } from 'temporal-polyfill';
import { Task } from '@/models/Task';

export interface TaskEndDateInplaceProps {
	task: Task;
	textProps?: ComponentProps<typeof InplaceTextDisplay>
	inputProps?: ComponentProps<typeof InplacePlainDateEdit>;
}

export function TaskEndDateInplace({ task, textProps, inputProps }: TaskEndDateInplaceProps) {
	const taskMutation = useUpdateTaskMutation();

	const onValueSubmit = (value: Temporal.PlainDate | null) => {
		taskMutation.mutate({
			id: task.id,
			request: {
				endDate: value
			}
		});
	}

	return (
		<InplaceEditor loading={taskMutation.isPending}>
			<InplaceEditorDisplay>
				{
					task.endDate
					? <InplaceTextDisplay {...textProps}>{task.endDate.toLocaleString()}</InplaceTextDisplay>
						: <InplaceTextDisplay c='dimmed' {...textProps}>No date</InplaceTextDisplay>
				}

			</InplaceEditorDisplay>
			<InplaceEditorEdit>
				<InplacePlainDateEdit {...inputProps} defaultValue={task.endDate?.toJSON()} onValueSubmit={onValueSubmit} />
			</InplaceEditorEdit>
		</InplaceEditor>
	)
}
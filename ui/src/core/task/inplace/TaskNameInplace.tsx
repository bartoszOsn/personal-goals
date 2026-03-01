import { useUpdateTaskMutation } from '@/api/task/task-hooks.ts';
import { InplaceEditor } from '@/base/inplace-editor/api/InplaceEditor.tsx';
import { InplaceEditorDisplay } from '@/base/inplace-editor/api/InplaceEditorDisplay.tsx';
import { InplaceTextDisplay } from '@/base/inplace-editor/api/primitive/display/InplaceTextDisplay.tsx';
import { InplaceEditorEdit } from '@/base/inplace-editor/api/InplaceEditorEdit.tsx';
import { InplaceTextInputEdit } from '@/base/inplace-editor/api/primitive/edit/InplaceTextInputEdit.tsx';
import { ComponentProps } from 'react';
import { Task } from '@/models/Task';
import { useTaskModal } from '@/core/task/modal/useTaskModal';
import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconFileInvoice } from '@tabler/icons-react';

export interface TaskNameInplaceProps {
	task: Task;
	textProps?: ComponentProps<typeof InplaceTextDisplay>
	inputProps?: ComponentProps<typeof InplaceTextInputEdit>;
	showDialogButton?: boolean;
}

export function TaskNameInplace({ task, textProps, inputProps, showDialogButton = true }: TaskNameInplaceProps) {
	const taskMutation = useUpdateTaskMutation();
	const openTaskDialog = useTaskModal();

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
				<Group gap='xs' wrap='nowrap' style={{ overflow: 'hidden' }}>
					{
						showDialogButton && (
							<Tooltip label='Open task'>
								<ActionIcon size='xs' color='gray' variant='subtle' onClick={() => openTaskDialog(task.id)}>
									<IconFileInvoice />
								</ActionIcon>
							</Tooltip>
						)
					}
					<InplaceTextDisplay {...textProps}>{task.name}</InplaceTextDisplay>
				</Group>
			</InplaceEditorDisplay>
			<InplaceEditorEdit>
				<InplaceTextInputEdit {...inputProps} defaultValue={task.name} onValueSubmit={onValueSubmit} />
			</InplaceEditorEdit>
		</InplaceEditor>
	)
}
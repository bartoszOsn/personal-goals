import { ComponentProps } from 'react';
import { InplaceSelectEdit } from '@/base/inplace-editor/api/primitive/edit/InplaceSelectEdit.tsx';
import { useUpdateTaskMutation } from '@/api/task/task-hooks.ts';
import { InplaceEditorDisplay } from '@/base/inplace-editor/api/InplaceEditorDisplay.tsx';
import { InplaceEditorEdit } from '@/base/inplace-editor/api/InplaceEditorEdit.tsx';
import { InplaceEditor } from '@/base/inplace-editor/api/InplaceEditor.tsx';
import { ComboboxData } from '@mantine/core';
import { Task } from '@/models/Task';
import { InplaceTextDisplay } from '@/base/inplace-editor/api/primitive/display/InplaceTextDisplay.tsx';
import { useOkrQuery } from '@/api/okr-hooks.ts';
import { KeyResultId } from '@/models/KeyResult.ts';

export interface TaskKeyResultInplaceProps {
	task: Task;
	textProps?: ComponentProps<typeof InplaceTextDisplay>
	selectProps?: ComponentProps<typeof InplaceSelectEdit>;
}

export function TaskKeyResultInplace({ task, textProps, selectProps}: TaskKeyResultInplaceProps) {
	const taskMutation = useUpdateTaskMutation();
	const objectivesQuery = useOkrQuery();

	const onValueSubmit = (value: KeyResultId | null) => {
		taskMutation.mutate({
			id: task.id,
			request: {
				keyResultId: value,
			}
		});
	}

	const selectedKR = objectivesQuery.data?.objectives.flatMap(o => o.keyResults)
		.find(kr => kr.id === task.keyResultId) ?? null;

	const items: ComboboxData = objectivesQuery.data?.objectives.map(o => ({
		group: o.name,
		items: o.keyResults.map(kr => ({ value: kr.id, label: kr.name }))
	})) ?? [];

	return (
		<InplaceEditor loading={taskMutation.isPending || objectivesQuery.isPending || !objectivesQuery.data}>
			<InplaceEditorDisplay>
				{
					selectedKR === null && (
						<InplaceTextDisplay c="dimmed" {...textProps}>No Key Result</InplaceTextDisplay>
					)
				}
				{
					selectedKR !== null && (
						<InplaceTextDisplay {...textProps}>{selectedKR.name}</InplaceTextDisplay>
					)
				}
			</InplaceEditorDisplay>
			<InplaceEditorEdit>
				<InplaceSelectEdit defaultValue={selectedKR?.id}
								   data={items}
								   onValueSubmit={(value) => value && onValueSubmit(value as KeyResultId)}
								   {...selectProps} />
			</InplaceEditorEdit>
		</InplaceEditor>
	)
}

import { Task } from '@/models/Task.ts';
import { ComponentProps } from 'react';
import { InplaceTextDisplay } from '@/base/inplace-editor/api/primitive/display/InplaceTextDisplay.tsx';
import { InplaceMultiSelectEdit } from '@/base/inplace-editor/api/primitive/edit/InplaceMultiSelectEdit.tsx';
import { useSprintQuery } from '@/api/sprint/sprint-hooks.ts';
import { SprintId } from '@/models/Sprint.ts';
import { InplaceEditor } from '@/base/inplace-editor/api/InplaceEditor.tsx';
import { InplaceEditorDisplay } from '@/base/inplace-editor/api/InplaceEditorDisplay.tsx';
import { getSprintName } from '@/core/getSprintName.ts';
import { InplaceEditorEdit } from '@/base/inplace-editor/api/InplaceEditorEdit.tsx';
import { ComboboxData } from '@mantine/core';
import { useUpdateTaskMutation } from '@/api/task/task-hooks.ts';

export interface TaskSprintInplaceProps {
	task: Task;
	textProps?: ComponentProps<typeof InplaceTextDisplay>
	multiSelectProps?: ComponentProps<typeof InplaceMultiSelectEdit>;
}

export function TaskSprintInplace({task, textProps, multiSelectProps}: TaskSprintInplaceProps) {
	const taskMutation = useUpdateTaskMutation();
	const sprintQuery = useSprintQuery();

	const allSprints = sprintQuery.data ?? [];
	const selectedSprints = allSprints
		.filter(sprint => task.sprintIds.includes(sprint.id));

	const selectedSprintIds = selectedSprints.map(s => s.id);

	const onValueSubmit = (value: SprintId[]) => {
		taskMutation.mutate({
			id: task.id,
			request: {
				sprintIds: value,
			}
		});
	}

	const items: ComboboxData = allSprints.map(sprint => ({
		value: sprint.id,
		label: getSprintName(sprint)
	}));

	return (
		<InplaceEditor loading={taskMutation.isPending || sprintQuery.isLoading || !sprintQuery.data}>
			<InplaceEditorDisplay>
				{
					selectedSprints.length === 0
						? (
							<InplaceTextDisplay c='dimmed' {...textProps}>No Sprints</InplaceTextDisplay>
						) : selectedSprints.length === 1
							? (
								<InplaceTextDisplay {...textProps}>{getSprintName(selectedSprints[0])}</InplaceTextDisplay>
							) : (
								<InplaceTextDisplay {...textProps}>{getSprintName(selectedSprints[selectedSprints.length - 1])} and { selectedSprints.length - 1 }</InplaceTextDisplay>
							)
				}
			</InplaceEditorDisplay>
			<InplaceEditorEdit>
				<InplaceMultiSelectEdit data={items}
										defaultValue={selectedSprintIds}
										onValueSubmit={ids => onValueSubmit(ids as SprintId[])}
										{...multiSelectProps} />
			</InplaceEditorEdit>
		</InplaceEditor>
	)
}
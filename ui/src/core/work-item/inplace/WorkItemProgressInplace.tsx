import { InplaceEditor } from '@/base/inplace-editor/api/InplaceEditor.tsx';
import { InplaceEditorDisplay } from '@/base/inplace-editor/api/InplaceEditorDisplay.tsx';
import { InplaceEditorEdit } from '@/base/inplace-editor/api/InplaceEditorEdit.tsx';
import { ComponentProps, ReactNode } from 'react';
import { Group, Progress, Text } from '@mantine/core';
import { WorkItemOld } from '@/models/WorkItemOld.ts';
import { useUpdateWorkItemMutation } from '@/api/work-item-old/work-item-hooks.ts';
import { InplaceCustomDisplayWrapper } from '@/base/inplace-editor/api/primitive/display/InplaceCustomDisplayWrapper.tsx';
import { InplaceNumberInputEdit } from '@/base/inplace-editor/api/primitive/edit/InplaceNumberInputEdit.tsx';

export interface WorkItemProgressInplaceProps {
	workItem: WorkItemOld;
	inputProps?: ComponentProps<typeof InplaceNumberInputEdit>;
}

export function WorkItemProgressInplace({ workItem, inputProps }: WorkItemProgressInplaceProps) {
	const updateWorkItemMutation = useUpdateWorkItemMutation();

	const onValueSubmit = (value: number) => {
		updateWorkItemMutation.mutate({
			id: workItem.id,
			request: {
				progress: value,
			}
		});
	}

	const display: ReactNode = (
		<Group gap='xs' w='100%'>
			<Progress color={workItem.progress.progress === 100 ? 'green' : 'blue'} value={workItem.progress.progress} flex={1} />
			<Text size='xs' c='dimmed' w={30}>{workItem.progress.progress}%</Text>
		</Group>
	)

	return (
		<InplaceEditor loading={updateWorkItemMutation.isPending}>
			<InplaceEditorDisplay>
				{
					workItem.progress.canChange
						? <InplaceCustomDisplayWrapper>{display}</InplaceCustomDisplayWrapper>
						: display
				}
			</InplaceEditorDisplay>
			<InplaceEditorEdit>
				<InplaceNumberInputEdit {...inputProps} defaultValue={workItem.progress.progress} onValueSubmit={onValueSubmit} />
			</InplaceEditorEdit>
		</InplaceEditor>
	)
}
import { InplaceEditor } from '@/base/inplace-editor/api/InplaceEditor.tsx';
import { InplaceEditorDisplay } from '@/base/inplace-editor/api/InplaceEditorDisplay.tsx';
import { InplaceTextDisplay } from '@/base/inplace-editor/api/primitive/display/InplaceTextDisplay.tsx';
import { InplaceEditorEdit } from '@/base/inplace-editor/api/InplaceEditorEdit.tsx';
import { InplaceTextInputEdit } from '@/base/inplace-editor/api/primitive/edit/InplaceTextInputEdit.tsx';
import { ComponentProps } from 'react';
import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconFileInvoice } from '@tabler/icons-react';
import { Objective } from '@/models/Objective.ts';
import { useOKRUpdateMutation } from '@/api/okr/okr-hooks.ts';
import { useObjectiveModal } from '@/core/objective/modal/useObjectiveModal';

export interface ObjectiveNameInplaceProps {
	objective: Objective;
	textProps?: ComponentProps<typeof InplaceTextDisplay>
	inputProps?: ComponentProps<typeof InplaceTextInputEdit>;
	showDialogButton?: boolean;
}

export function ObjectiveNameInplace({ objective, textProps, inputProps, showDialogButton = true }: ObjectiveNameInplaceProps) {
	const objectiveMutation = useOKRUpdateMutation();
	const openModal = useObjectiveModal();

	const onValueSubmit = (value: string) => {
		objectiveMutation.mutate({
			id: objective.id,
			request: {
				name: value,
			}
		});
	}

	return (
		<InplaceEditor loading={objectiveMutation.isPending}>
			<InplaceEditorDisplay>
				<Group gap='xs' wrap='nowrap' style={{ overflow: 'hidden' }}>
					{
						showDialogButton && (
							<Tooltip label='Open objective'>
								<ActionIcon size='xs' color='grape' variant='subtle' onClick={() => openModal(objective.id)}>
									<IconFileInvoice />
								</ActionIcon>
							</Tooltip>
						)
					}
					<InplaceTextDisplay {...textProps}>{objective.name}</InplaceTextDisplay>
				</Group>
			</InplaceEditorDisplay>
			<InplaceEditorEdit>
				<InplaceTextInputEdit {...inputProps} defaultValue={objective.name} onValueSubmit={onValueSubmit} />
			</InplaceEditorEdit>
		</InplaceEditor>
	)
}
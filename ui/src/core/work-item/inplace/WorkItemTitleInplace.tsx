import { InplaceEditor } from '@/base/inplace-editor/api/InplaceEditor.tsx';
import { InplaceEditorDisplay } from '@/base/inplace-editor/api/InplaceEditorDisplay.tsx';
import { InplaceTextDisplay } from '@/base/inplace-editor/api/primitive/display/InplaceTextDisplay.tsx';
import { InplaceEditorEdit } from '@/base/inplace-editor/api/InplaceEditorEdit.tsx';
import { InplaceTextInputEdit } from '@/base/inplace-editor/api/primitive/edit/InplaceTextInputEdit.tsx';
import { ComponentProps } from 'react';
import { ActionIcon, Group, MantineColor, Tooltip } from '@mantine/core';
import { IconFileInvoice } from '@tabler/icons-react';
import { WorkItemOld, WorkItemType } from '@/models/WorkItemOld.ts';
import { useUpdateWorkItemMutation } from '@/api/work-item-old/work-item-hooks.ts';
import { useWorkItemDetailsModal } from '@/core/work-item/details/useWorkItemDetailsModal';
import { Link } from '@tanstack/react-router';

export interface WorkItemTitleInplaceProps {
	workItem: WorkItemOld;
	textProps?: ComponentProps<typeof InplaceTextDisplay>
	inputProps?: ComponentProps<typeof InplaceTextInputEdit>;
	showDialogButton?: boolean;
}

export function WorkItemTitleInplace({ workItem, textProps, inputProps, showDialogButton = true }: WorkItemTitleInplaceProps) {
	const updateWorkItemMutation = useUpdateWorkItemMutation();
	const openWorkItemModal = useWorkItemDetailsModal();

	const onValueSubmit = (value: string) => {
		updateWorkItemMutation.mutate({
			id: workItem.id,
			request: {
				title: value,
			}
		});
	}

	return (
		<InplaceEditor loading={updateWorkItemMutation.isPending}>
			<InplaceEditorDisplay>
				<Group gap='xs' wrap='nowrap' style={{ overflow: 'hidden' }}>
					{
						showDialogButton && (
							<Tooltip label='Open task'>
								<ActionIcon size="xs"
											component={Link}
											to='/work/$context/details/$workItemId'
											params={{ context: workItem.contextYear.toString(), workItemId: workItem.id }}
											color={typeToAccentMap[workItem.type]}
											variant="subtle"
											onClick={(e) => { e.preventDefault(); openWorkItemModal(workItem.id)}}>
									<IconFileInvoice />
								</ActionIcon>
							</Tooltip>
						)
					}
					<InplaceTextDisplay {...textProps}>{workItem.title}</InplaceTextDisplay>
				</Group>
			</InplaceEditorDisplay>
			<InplaceEditorEdit>
				<InplaceTextInputEdit {...inputProps} defaultValue={workItem.title} onValueSubmit={onValueSubmit} />
			</InplaceEditorEdit>
		</InplaceEditor>
	)
}

const typeToAccentMap: Record<WorkItemType, MantineColor> = {
	[WorkItemType.TASK]: 'gray',
	[WorkItemType.OBJECTIVE]: 'grape',
	[WorkItemType.KEY_RESULT]: 'orange'
}
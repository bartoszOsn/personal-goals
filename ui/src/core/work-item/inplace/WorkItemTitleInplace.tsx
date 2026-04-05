import { InplaceEditor } from '@/base/inplace-editor/api/InplaceEditor.tsx';
import { InplaceEditorDisplay } from '@/base/inplace-editor/api/InplaceEditorDisplay.tsx';
import { InplaceTextDisplay } from '@/base/inplace-editor/api/primitive/display/InplaceTextDisplay.tsx';
import { InplaceEditorEdit } from '@/base/inplace-editor/api/InplaceEditorEdit.tsx';
import { InplaceTextInputEdit } from '@/base/inplace-editor/api/primitive/edit/InplaceTextInputEdit.tsx';
import { ComponentProps } from 'react';
import { ActionIcon, Group, MantineColor, Tooltip } from '@mantine/core';
import { IconFileInvoice } from '@tabler/icons-react';
import { useWorkItemDetailsModal } from '@/core/work-item/details/useWorkItemDetailsModal';
import { createLink } from '@tanstack/react-router';
import { WorkItem, WorkItemType } from '@/models/WorkItem';
import { useUpdateWorkItemsInHierarchyMutation } from '@/api/work-item/work-item-hooks';

export interface WorkItemTitleInplaceProps {
	workItem: WorkItem;
	textProps?: ComponentProps<typeof InplaceTextDisplay>
	inputProps?: ComponentProps<typeof InplaceTextInputEdit>;
	showDialogButton?: boolean;
}

export function WorkItemTitleInplace({ workItem, textProps, inputProps, showDialogButton = true }: WorkItemTitleInplaceProps) {
	const updateWorkItemMutation = useUpdateWorkItemsInHierarchyMutation();
	const openWorkItemModal = useWorkItemDetailsModal();

	const onValueSubmit = (value: string) => {
		updateWorkItemMutation.mutate({
			context: workItem.contextYear,
			request: {
				updates: {
					[workItem.id]: {
						title: value,
					}
				}
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
								<ActionIconLink size="xs"
											component={'a'}
											to='/work/$context/details/$workItemId'
											params={{ context: workItem.contextYear.toString(), workItemId: workItem.id }}
											color={typeToAccentMap[workItem.type]}
											variant="subtle"
											onClick={(e) => { e.preventDefault(); openWorkItemModal(workItem.id)}}>
									<IconFileInvoice />
								</ActionIconLink>
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

const ActionIconLink = createLink(ActionIcon<'a'>);

const typeToAccentMap: Record<WorkItemType, MantineColor> = {
	[WorkItemType.TASK]: 'gray',
	[WorkItemType.GOAL]: 'grape',
	[WorkItemType.GROUP]: 'gray'
}
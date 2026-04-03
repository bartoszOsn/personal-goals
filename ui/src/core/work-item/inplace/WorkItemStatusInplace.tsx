import * as react from 'react';
import { ComponentProps, ForwardRefExoticComponent } from 'react';
import { InplaceBadgeDisplay } from '@/base/inplace-editor/api/primitive/display/InplaceBadgeDisplay.tsx';
import { InplaceSelectEdit } from '@/base/inplace-editor/api/primitive/edit/InplaceSelectEdit.tsx';
import { InplaceEditorDisplay } from '@/base/inplace-editor/api/InplaceEditorDisplay.tsx';
import { InplaceEditorEdit } from '@/base/inplace-editor/api/InplaceEditorEdit.tsx';
import { InplaceEditor } from '@/base/inplace-editor/api/InplaceEditor.tsx';
import { ComboboxItem, ComboboxLikeRenderOptionInput, Group, MantineColor, Text } from '@mantine/core';
import { IconCheck, IconProgress, IconProgressCheck, IconProgressHelp, IconProgressX, IconProps } from '@tabler/icons-react';
import { WorkItemStatus } from '@/models/WorkItem.ts';
import { WorkItem } from '@/models/WorkItem';
import { useUpdateWorkItemsInHierarchyMutation } from '@/api/work-item/work-item-hooks';

export interface WorkItemStatusInplaceProps {
	workItem: WorkItem;
	badgeProps?: ComponentProps<typeof InplaceBadgeDisplay>
	selectProps?: ComponentProps<typeof InplaceSelectEdit>;
}

export function WorkItemStatusInplace({ workItem, badgeProps, selectProps}: WorkItemStatusInplaceProps) {
	const updateWorkItemMutation = useUpdateWorkItemsInHierarchyMutation();

	const onValueSubmit = (value: WorkItemStatus) => {
		updateWorkItemMutation.mutate({
			context: workItem.contextYear,
			request: {
				updates: {
					[workItem.id]: {
						status: value
					}
				}
			}
		});
	}

	const options: Array<ComboboxItem> = Object.entries(statusToName).map(([value, label]) => ({ value, label }));

	const renderOption = (option: ComboboxLikeRenderOptionInput<ComboboxItem>) => {
		const Icon = statusToIcon[option.option.value as WorkItemStatus];
		const color = statusToColor[option.option.value as WorkItemStatus];
		const cssColor = `var(--mantine-color-${color}-5)`;

		return (
			<Group gap='xs' w='100%'>
				<Icon size={16} color={cssColor} />
				<Text>{option.option.label}</Text>
				{ option.checked && <IconCheck style={{ marginInlineStart: 'auto' }} {...checkIconProps} />}
			</Group>
		);
	}

	return (
		<InplaceEditor loading={updateWorkItemMutation.isPending}>
			<InplaceEditorDisplay>
				<InplaceBadgeDisplay color={statusToColor[workItem.status]} {...badgeProps}>{statusToName[workItem.status]}</InplaceBadgeDisplay>
			</InplaceEditorDisplay>
			<InplaceEditorEdit>
				<InplaceSelectEdit defaultValue={workItem.status}
								   data={options}
								   renderOption={renderOption}
								   comboboxProps={{ width: '200px'}}
								   onValueSubmit={(value) => value && onValueSubmit(value as WorkItemStatus)}
								   {...selectProps} />
			</InplaceEditorEdit>
		</InplaceEditor>
	)
}

const statusToName: Record<WorkItemStatus, string> = {
	[WorkItemStatus.TODO]: 'To Do',
	[WorkItemStatus.IN_PROGRESS]: 'In Progress',
	[WorkItemStatus.DONE]: 'Done',
	[WorkItemStatus.FAILED]: 'Failed'
};

const statusToColor: Record<WorkItemStatus, MantineColor> = {
	[WorkItemStatus.TODO]: 'gray',
	[WorkItemStatus.IN_PROGRESS]: 'blue',
	[WorkItemStatus.DONE]: 'green',
	[WorkItemStatus.FAILED]: 'red'
};

const statusToIcon: Record<WorkItemStatus, ForwardRefExoticComponent<IconProps & react.RefAttributes<SVGSVGElement>>> = {
	[WorkItemStatus.TODO]: IconProgressHelp,
	[WorkItemStatus.IN_PROGRESS]: IconProgress,
	[WorkItemStatus.DONE]: IconProgressCheck,
	[WorkItemStatus.FAILED]: IconProgressX
}

const checkIconProps = {
	stroke: 1.5,
	color: 'currentColor',
	opacity: 0.6,
	size: 18,
};
import { ComponentProps, ForwardRefExoticComponent } from 'react';
import { InplaceBadgeDisplay } from '@/base/inplace-editor/api/primitive/display/InplaceBadgeDisplay.tsx';
import { InplaceSelectEdit } from '@/base/inplace-editor/api/primitive/edit/InplaceSelectEdit.tsx';
import { useUpdateTaskMutation } from '@/api/task/task-hooks.ts';
import { InplaceEditorDisplay } from '@/base/inplace-editor/api/InplaceEditorDisplay.tsx';
import { InplaceEditorEdit } from '@/base/inplace-editor/api/InplaceEditorEdit.tsx';
import { InplaceEditor } from '@/base/inplace-editor/api/InplaceEditor.tsx';
import { Text, ComboboxItem, ComboboxLikeRenderOptionInput, Group, MantineColor } from '@mantine/core';
import { Task, TaskStatus } from '@/models/Task';
import { IconCheck, IconProgress, IconProgressCheck, IconProgressHelp, IconProgressX, IconProps } from '@tabler/icons-react';
import * as react from 'react';

export interface TaskStatusInplaceProps {
	task: Task;
	badgeProps?: ComponentProps<typeof InplaceBadgeDisplay>
	selectProps?: ComponentProps<typeof InplaceSelectEdit>;
}

export function TaskStatusInplace({ task, badgeProps, selectProps}: TaskStatusInplaceProps) {
	const taskMutation = useUpdateTaskMutation();

	const onValueSubmit = (value: TaskStatus) => {
		taskMutation.mutate({
			id: task.id,
			request: {
				status: value,
			}
		});
	}

	const options: Array<ComboboxItem> = Object.entries(statusToName).map(([value, label]) => ({ value, label }));

	const renderOption = (option: ComboboxLikeRenderOptionInput<ComboboxItem>) => {
		const Icon = statusToIcon[option.option.value as TaskStatus];
		const color = statusToColor[option.option.value as TaskStatus];
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
		<InplaceEditor loading={taskMutation.isPending}>
			<InplaceEditorDisplay>
				<InplaceBadgeDisplay color={statusToColor[task.status]} {...badgeProps}>{statusToName[task.status]}</InplaceBadgeDisplay>
			</InplaceEditorDisplay>
			<InplaceEditorEdit>
				<InplaceSelectEdit defaultValue={task.status}
								   data={options}
								   renderOption={renderOption}
								   onValueSubmit={(value) => value && onValueSubmit(value as TaskStatus)}
								   {...selectProps} />
			</InplaceEditorEdit>
		</InplaceEditor>
	)
}

const statusToName: Record<TaskStatus, string> = {
	[TaskStatus.TODO]: 'To Do',
	[TaskStatus.IN_PROGRESS]: 'In Progress',
	[TaskStatus.DONE]: 'Done',
	[TaskStatus.FAILED]: 'Failed'
};

const statusToColor: Record<TaskStatus, MantineColor> = {
	[TaskStatus.TODO]: 'gray',
	[TaskStatus.IN_PROGRESS]: 'blue',
	[TaskStatus.DONE]: 'green',
	[TaskStatus.FAILED]: 'red'
};

const statusToIcon: Record<TaskStatus, ForwardRefExoticComponent<IconProps & react.RefAttributes<SVGSVGElement>>> = {
	[TaskStatus.TODO]: IconProgressHelp,
	[TaskStatus.IN_PROGRESS]: IconProgress,
	[TaskStatus.DONE]: IconProgressCheck,
	[TaskStatus.FAILED]: IconProgressX
}

const checkIconProps = {
	stroke: 1.5,
	color: 'currentColor',
	opacity: 0.6,
	size: 18,
};
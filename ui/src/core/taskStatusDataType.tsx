import { DataType } from '@/base/data-type';
import { Badge, ColorSwatch, Combobox, Group, MantineColor, Text, useCombobox } from '@mantine/core';
import { TaskStatus } from '@/models/Task';

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

const toCSSVar = (color: MantineColor) => `var(--mantine-color-${color}-5)`;

export const taskStatusDataType: DataType<TaskStatus> = {
	Presenter: ({ value, onEdit }) => (
		<Badge color={statusToColor[value]} onClick={onEdit} style={{ cursor: onEdit ? 'pointer' : 'default' }}>{statusToName[value]}</Badge>
	),
	Editor: ({ value, onCancel, onSubmit }) => {
		const combobox = useCombobox({
			defaultOpened: true,
		});

		return <Combobox store={combobox}
						 onOptionSubmit={(value) => onSubmit(value as TaskStatus)}
						onDismiss={onCancel} width='max-content'>
			<Combobox.Target>
				<Badge color={statusToColor[value]} tabIndex={0} autoFocus
					   style={{ cursor: 'pointer' }}>{statusToName[value]}</Badge>
			</Combobox.Target>
			<Combobox.Dropdown>
				<Combobox.Options>
					{(Object.entries(statusToName) as [TaskStatus, string][]).map(([status, name]) => (
						<Combobox.Option key={status} value={status}>
							<Group gap='xs'>
								<ColorSwatch color={toCSSVar(statusToColor[status])} size={12} />
								<Text inherit>{name}</Text>
							</Group>
						</Combobox.Option>
					))}
				</Combobox.Options>
			</Combobox.Dropdown>
		</Combobox>
	}
}
import { DataType } from '@/base/data-type';
import { TaskStatusDTO } from '@personal-okr/shared';
import { Badge, ColorSwatch, Combobox, Group, MantineColor, Text, useCombobox } from '@mantine/core';

const statusToName: Record<TaskStatusDTO, string> = {
	TODO: 'To Do',
	IN_PROGRESS: 'In Progress',
	DONE: 'Done',
	FAILED: 'Failed'
};

const statusToColor: Record<TaskStatusDTO, MantineColor> = {
	TODO: 'gray',
	IN_PROGRESS: 'blue',
	DONE: 'green',
	FAILED: 'red'
};

const toCSSVar = (color: MantineColor) => `var(--mantine-color-${color}-5)`;

export const taskStatusDataType: DataType<TaskStatusDTO> = {
	Presenter: ({ value, onEdit }) => (
		<Badge color={statusToColor[value]} onClick={onEdit} style={{ cursor: onEdit ? 'pointer' : 'default' }}>{statusToName[value]}</Badge>
	),
	Editor: ({ value, onCancel, onSubmit }) => {
		const combobox = useCombobox({
			defaultOpened: true,
		});

		return <Combobox store={combobox}
						 onOptionSubmit={(value) => onSubmit(value as TaskStatusDTO)}
						onDismiss={onCancel} width='max-content'>
			<Combobox.Target>
				<Badge color={statusToColor[value]} tabIndex={0} autoFocus
					   style={{ cursor: 'pointer' }}>{statusToName[value]}</Badge>
			</Combobox.Target>
			<Combobox.Dropdown>
				<Combobox.Options>
					{(Object.entries(statusToName) as [TaskStatusDTO, string][]).map(([status, name]) => (
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
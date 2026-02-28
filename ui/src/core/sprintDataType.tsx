import { DataType } from '@/base/data-type';
import { ComboboxData, MultiSelect, Skeleton, Text } from '@mantine/core';
import { useSprintQuery } from '@/api/sprint-hooks.ts';
import { getSprintName } from '@/core/getSprintName.ts';
import { SprintId } from '@/models/Sprint';

export const sprintDataType: DataType<SprintId[]> = {
	Presenter: ({ value, onEdit }) => {
		const sprintQuery = useSprintQuery();

		if (sprintQuery.isPending) {
			return <Skeleton w="100%" h="100%" mih="30px" />;
		}

		const sprints = (sprintQuery.data?.sprints ?? [])
			.filter(sprint => value.includes(sprint.id as SprintId)); // TODO: There won't be an error after creating sprint model.

		if (sprints.length === 0) {
			return <Text onClick={onEdit} inherit c="dimmed" style={{ cursor: onEdit ? 'pointer' : 'default' }}>No Sprints</Text>;
		} else if (sprints.length === 1) {
			return <Text onClick={onEdit} inherit style={{ cursor: onEdit ? 'pointer' : 'default' }}>{getSprintName(sprints[0])}</Text>
		}

		return (
			<Text onClick={onEdit} inherit style={{ cursor: onEdit ? 'pointer' : 'default' }}>{getSprintName(sprints[sprints.length - 1])} and { sprints.length - 1 } more</Text>
		);
	},
	Editor: ({ value, onCancel, onSubmit }) => {
		const sprintQuery = useSprintQuery();

		if (sprintQuery.isPending) {
			return <Skeleton w="100%" h="100%" mih="30px" />;
		}

		const allSprints = sprintQuery.data?.sprints ?? [];
		const selectedSprintIds = allSprints
			.filter(sprint => value.includes(sprint.id as SprintId)) // TODO: There won't be an error after creating sprint model.
			.map(sprint => sprint.id);

		const items: ComboboxData = allSprints.map(sprint => ({
			value: sprint.id,
			label: getSprintName(sprint)
		}));

		return (
			<MultiSelect data={items}
					value={selectedSprintIds}
					searchable
					dropdownOpened={true}
					onChange={(value) => onSubmit(value as SprintId[])}  // TODO: There won't be an error after creating sprint model.
					onClear={() => onSubmit([])}
					onBlur={onCancel} />
		);
	}
}
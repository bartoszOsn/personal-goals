import type { DataType } from '@/base/data-type';
import { type ComboboxData, MultiSelect, Skeleton, Text } from '@mantine/core';
import { useSprintQuery } from '@/api/sprint-hooks.ts';
import { getSprintName } from '@/core/getSprintName.ts';

export const sprintDataType: DataType<string[]> = {
	Presenter: ({ value, onEdit }) => {
		const sprintQuery = useSprintQuery();

		if (sprintQuery.isPending) {
			return <Skeleton w="100%" h="100%" mih="30px" />;
		}

		const sprints = (sprintQuery.data?.sprints ?? [])
			.filter(sprint => value.includes(sprint.id));

		if (sprints.length === 0) {
			return <Text onClick={onEdit} inherit c="dimmed" style={{ cursor: 'pointer' }}>No Sprints</Text>;
		} else if (sprints.length === 1) {
			return <Text onClick={onEdit} inherit style={{ cursor: 'pointer' }}>{getSprintName(sprints[0])}</Text>
		}

		return (
			<Text onClick={onEdit} inherit style={{ cursor: 'pointer' }}>{getSprintName(sprints[sprints.length - 1])} and { sprints.length - 1 } more</Text>
		);
	},
	Editor: ({ value, onCancel, onSubmit }) => {
		const sprintQuery = useSprintQuery();

		if (sprintQuery.isPending) {
			return <Skeleton w="100%" h="100%" mih="30px" />;
		}

		const allSprints = sprintQuery.data?.sprints ?? [];
		const selectedSprintIds = allSprints
			.filter(sprint => value.includes(sprint.id))
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
					onChange={(value) => onSubmit(value)}
					onClear={() => onSubmit([])}
					onBlur={onCancel} />
		);
	}
}
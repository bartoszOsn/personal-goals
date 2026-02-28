import { DataType } from '@/base/data-type';
import { ComboboxData, Select, Skeleton, Text } from '@mantine/core';
import { useOkrQuery } from '@/api/okr-hooks.ts';
import { KeyResultId } from '@/models/KeyResult';

export const keyResultIdDataType: DataType<KeyResultId | null> = {
	Presenter: ({ value, onEdit }) => {
		const objectivesQuery = useOkrQuery();

		if (objectivesQuery.isPending) {
			return <Skeleton w="100%" h="100%" mih="30px" />;
		}

		const kr = objectivesQuery.data?.objectives.flatMap(o => o.keyResults)
			.find(kr => kr.id === value);

		if (value === null || kr === undefined) {
			return <Text onClick={onEdit} inherit c="dimmed" style={{ cursor: onEdit ? 'pointer' : 'default' }}>No Key Result</Text>;
		}

		return (
			<Text onClick={onEdit} inherit style={{ cursor: onEdit ? 'pointer' : 'default' }}>{kr.name}</Text>
		);
	},
	Editor: ({ value, onCancel, onSubmit }) => {
		const objectivesQuery = useOkrQuery();

		if (objectivesQuery.isPending) {
			return <Skeleton w="100%" h="100%" mih="30px" />;
		}

		const krsWithObjectives = objectivesQuery.data?.objectives.flatMap(o => o.keyResults) ?? [];

		const selectedKr = krsWithObjectives
			.find(kr => kr.id === value);

		const items: ComboboxData = objectivesQuery.data?.objectives.map(o => ({
			group: o.name,
			items: o.keyResults.map(kr => ({ value: kr.id, label: kr.name }))
		})) ?? [];

		return (
			<Select data={items}
					value={selectedKr?.id}
					allowDeselect
					searchable
					dropdownOpened={true}
					onChange={(value) => onSubmit(value as KeyResultId ?? null)}
					onClear={() => onSubmit(null)}
					onBlur={onCancel} />
		);
	}
};
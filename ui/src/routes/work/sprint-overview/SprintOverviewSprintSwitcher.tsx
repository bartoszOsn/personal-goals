import { useSprintQuery } from '@/api/sprint/sprint-hooks.ts';
import { ComboboxData, Group, Pagination, Select, Skeleton } from '@mantine/core';
import { SprintId } from '@/models/Sprint';

export function SprintOverviewSprintSwitcher
({ context, sprintId, onChange }: { context: number, sprintId: SprintId, onChange: (value: SprintId) => void }) {
	const sprintQuery = useSprintQuery(context);

	if (sprintQuery.isPending || !sprintQuery.data) {
		return <Skeleton w="100%" h={36} />
	}

	const value = sprintQuery.data.findIndex(s => s.id === sprintId) + 1;
	const total = sprintQuery.data.length;

	const onSprintSelect = (index: number) => {
		onChange(sprintQuery.data[index - 1].id);
	}

	const data: ComboboxData = sprintQuery.data.map(s => ({ value: s.id, label: s.name }));

	return (
		<Pagination.Root value={value} total={total} size={36} onChange={onSprintSelect}>
			<Group gap={5} justify='center'>
				<Pagination.Previous />
				<Select value={sprintId}
						data={data}
						searchable
						size='sm'
						onChange={(v) => v && onChange(v as SprintId)} />
				<Pagination.Next />
			</Group>
		</Pagination.Root>
	)
}
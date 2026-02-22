import { useSprintQuery } from '@/api/sprint-hooks.ts';
import { type ComboboxData, Group, Pagination, Select, Skeleton } from '@mantine/core';
import { getSprintName } from '@/core/getSprintName';

export function SprintOverviewSprintSwitcher
({ sprintId, onChange }: { sprintId: string, onChange: (value: string) => void }) {
	const sprintQuery = useSprintQuery();

	if (sprintQuery.isPending || !sprintQuery.data) {
		return <Skeleton w="100%" h={30} />
	}

	const value = sprintQuery.data.sprints.findIndex(s => s.id === sprintId) + 1;
	const total = sprintQuery.data.sprints.length;

	const onSprintSelect = (index: number) => {
		onChange(sprintQuery.data.sprints[index - 1].id);
	}

	const data: ComboboxData = sprintQuery.data.sprints.map(s => ({ value: s.id, label: getSprintName(s) }));

	return (
		<Pagination.Root value={value} total={total} size={36} onChange={onSprintSelect}>
			<Group gap={5} justify='center'>
				<Pagination.Previous />
				<Select value={sprintId}
						data={data}
						searchable
						size='sm'
						onChange={(v) => v && onChange(v)} />
				<Pagination.Next />
			</Group>
		</Pagination.Root>
	)
}
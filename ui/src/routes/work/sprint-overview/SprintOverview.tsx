import { Stack } from '@mantine/core';
import { SprintOverviewSprintSwitcher } from '@/routes/work/sprint-overview/SprintOverviewSprintSwitcher';
import { useNavigate } from '@tanstack/react-router';

export function SprintOverview({ sprintId }: { sprintId: string }) {
	const navigate = useNavigate();

	const onSprintIdChange = (newId: string) => {
		navigate({ to: `/work/sprint-overview/{-$sprintId}`, params: { sprintId: newId } })
			.then();
	}

	return (
		<Stack p="lg">
			<SprintOverviewSprintSwitcher sprintId={sprintId} onChange={onSprintIdChange} />
		</Stack>
	)
}
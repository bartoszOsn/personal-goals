import { Stack } from '@mantine/core';
import { SprintOverviewSprintSwitcher } from '@/routes/work/sprint-overview/SprintOverviewSprintSwitcher';
import { useNavigate } from '@tanstack/react-router';
import { SprintOverviewSprintInfo } from '@/routes/work/sprint-overview/SprintOverviewSprintInfo';
import { SprintOverviewTaskBoard } from '@/routes/work/sprint-overview/SprintOverviewTaskBoard';
import { SprintId } from '@/models/Sprint';

export function SprintOverview({ sprintId }: { sprintId: SprintId }) {
	const navigate = useNavigate();

	const onSprintIdChange = (newId: string) => {
		navigate({ to: `/work/sprint-overview/{-$sprintId}`, params: { sprintId: newId } })
			.then();
	}

	return (
		<Stack p="lg">
			<SprintOverviewSprintSwitcher sprintId={sprintId} onChange={onSprintIdChange} />
			<SprintOverviewSprintInfo sprintId={sprintId} />
			<SprintOverviewTaskBoard sprintId={sprintId} />
		</Stack>
	)
}
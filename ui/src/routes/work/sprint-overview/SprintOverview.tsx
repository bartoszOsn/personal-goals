import { Stack } from '@mantine/core';
import { SprintOverviewSprintSwitcher } from '@/routes/work/sprint-overview/SprintOverviewSprintSwitcher';
import { useNavigate } from '@tanstack/react-router';
import { SprintOverviewSprintInfo } from '@/routes/work/sprint-overview/SprintOverviewSprintInfo';
import { SprintOverviewTaskBoard } from '@/routes/work/sprint-overview/SprintOverviewTaskBoard';
import { SprintId } from '@/models/Sprint';

export function SprintOverview({ context, sprintId }: { context: number, sprintId: SprintId }) {
	const navigate = useNavigate();

	const onSprintIdChange = (newId: string) => {
		navigate({
			to: `.`,
			params: (prev) => ({ ...prev, sprintId: newId })
		})
			.then();
	}

	return (
		<Stack p="lg">
			<SprintOverviewSprintSwitcher context={context} sprintId={sprintId} onChange={onSprintIdChange} />
			<SprintOverviewSprintInfo context={context} sprintId={sprintId} />
			<SprintOverviewTaskBoard context={context} sprintId={sprintId} />
		</Stack>
	)
}
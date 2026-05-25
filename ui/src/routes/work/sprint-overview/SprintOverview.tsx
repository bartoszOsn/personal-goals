import { SprintOverviewSprintSwitcher } from '@/routes/work/sprint-overview/SprintOverviewSprintSwitcher.tsx';
import { Navigate, useNavigate } from '@tanstack/react-router';
import { SprintOverviewSprintInfo } from '@/routes/work/sprint-overview/SprintOverviewSprintInfo.tsx';
import { SprintOverviewTaskBoard } from '@/routes/work/sprint-overview/SprintOverviewTaskBoard.tsx';
import { SprintId } from '@/models/Sprint.ts';
import { PageContent, PageContentContent, PageContentHeader } from '@/base/PageContent.tsx';
import { useSprintQuery } from '@/api/sprint/sprint-hooks';
import { SprintOverviewSkeleton } from '@/routes/work/sprint-overview/SprintOverviewSkeleton';

export function SprintOverview({ context, sprintId }: { context: number, sprintId: SprintId }) {
	const sprint = useSprintQuery(context);

	const navigate = useNavigate();

	const onSprintIdChange = (newId: string) => {
		navigate({
			to: `.`,
			params: (prev) => ({ ...prev, sprintId: newId })
		})
			.then();
	};

	if (!sprint.data || sprint.isLoading) {
		return <SprintOverviewSkeleton />
	}

	if (!sprint.data.some(s => s.id === sprintId)) {
		return <Navigate to='/work/$context/sprint-overview' params={{ context: context.toString() }} />;
	}

	return (
		<PageContent>
			<PageContentHeader>
				<div className="flex-1 flex flex-col items-center">
					<SprintOverviewSprintSwitcher context={context} sprintId={sprintId} onChange={onSprintIdChange} />
				</div>
			</PageContentHeader>
			<PageContentContent>
				<SprintOverviewSprintInfo context={context} sprintId={sprintId} />
				<SprintOverviewTaskBoard context={context} sprintId={sprintId} />
			</PageContentContent>
		</PageContent>
	);
}
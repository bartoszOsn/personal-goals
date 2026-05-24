import { SprintOverviewSprintSwitcher } from '@/routes/work/sprint-overview/SprintOverviewSprintSwitcher';
import { useNavigate } from '@tanstack/react-router';
import { SprintOverviewSprintInfo } from '@/routes/work/sprint-overview/SprintOverviewSprintInfo';
import { SprintOverviewTaskBoard } from '@/routes/work/sprint-overview/SprintOverviewTaskBoard';
import { SprintId } from '@/models/Sprint';
import { PageContent, PageContentContent, PageContentHeader } from '@/base/PageContent';

export function SprintOverview({ context, sprintId }: { context: number, sprintId: SprintId }) {
	const navigate = useNavigate();

	const onSprintIdChange = (newId: string) => {
		navigate({
			to: `.`,
			params: (prev) => ({ ...prev, sprintId: newId })
		})
			.then();
	};

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
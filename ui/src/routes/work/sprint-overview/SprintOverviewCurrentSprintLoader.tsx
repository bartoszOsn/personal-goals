import { useSprintQuery } from '@/api/sprint/sprint-hooks';
import { useEffect } from 'react';
import { Temporal } from 'temporal-polyfill';
import { isPlainDate } from '@personal-okr/shared';
import { useNavigate } from '@tanstack/react-router';
import { PageContent, PageContentContent, PageContentHeader } from '@/base/PageContent';
import { Skeleton } from '@/primitive/components/ui/skeleton';

export function SprintOverviewCurrentSprintLoader() {
	const sprints = useSprintQuery(Temporal.Now.plainDateISO().year);
	const navigate = useNavigate();

	useEffect(() => {
		if (sprints.isPending) {
			return;
		}

		if (!sprints.data) {
			return;
		}

		const currentSprint = sprints.data
			.find(sprint => {
				const start = sprint.startDate;
				const end = sprint.endDate;
				const now = Temporal.Now.plainDateISO();

				return isPlainDate(now).afterOrEqual(start) && isPlainDate(now).beforeOrEqual(end);
			});

		const navigateTo = currentSprint ?? sprints.data[0];

		if (navigateTo) {
			navigate({ to: '.', params: (prev) => ({ ...prev, sprintId: navigateTo.id })})
				.then();
		}
	}, [sprints.isPending, sprints.data, navigate]);

	if (sprints.data?.length === 0) {
		return "No sprints found";
	}

	return (
		<PageContent>
			<PageContentHeader>
				<div className="flex-1 flex flex-col items-center">
					<Skeleton className='h-5 w-full' />
				</div>
			</PageContentHeader>
			<PageContentContent>
				<Skeleton className='w-full h-30 mb-4' />
				<div className='w-full h-70 flex flex-row gap-4'>
					<Skeleton className='h-70 flex-1' />
					<Skeleton className='h-70 flex-1' />
					<Skeleton className='h-70 flex-1' />
				</div>
			</PageContentContent>
		</PageContent>
	);
}
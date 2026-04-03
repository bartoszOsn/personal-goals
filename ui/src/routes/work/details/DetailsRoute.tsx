import { getRouteApi } from '@tanstack/react-router';
import { WorkItemId } from '@/models/WorkItem';
import { WorkItemDetailsSkeleton } from '@/core/work-item/details/WorkItemDetailsSkeleton';
import { WorkItemDetails } from '@/core/work-item/details/WorkItemDetails';
import { Stack } from '@mantine/core';
import { WorkItemTitleInplace } from '@/core/work-item/inplace/WorkItemTitleInplace';
import { useWorkItemDetailsQuery } from '@/api/work-item/work-item-hooks';

export function DetailsRoute() {
	const workItemId = getRouteApi('/work/$context/details/$workItemId').useParams({
		select: (params) => params.workItemId as WorkItemId
	});

	const workItemQuery = useWorkItemDetailsQuery(workItemId);

	if (workItemQuery.isLoading || !workItemQuery.data) {
		return <WorkItemDetailsSkeleton />
	}

	return (
		<Stack gap='xl' p='xl'>
			<WorkItemTitleInplace workItem={workItemQuery.data}
								  textProps={{ size: 'xl', fw: 'bold' }}
								  inputProps={{ size: 'lg' }}
								  showDialogButton={false} />
			<WorkItemDetails workItem={workItemQuery.data} />
		</Stack>
	)
}
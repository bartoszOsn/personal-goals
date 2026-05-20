import { getRouteApi } from '@tanstack/react-router';
import { WorkItemId } from '@/models/WorkItem';
import { WorkItemDetailsSkeleton } from '@/core/work-item/details/WorkItemDetailsSkeleton';
import { WorkItemDetails } from '@/core/work-item/details/WorkItemDetails';
import { useUpdateWorkItemsInHierarchyMutation, useWorkItemDetailsQuery } from '@/api/work-item/work-item-hooks';
import { PageContent, PageContentContent, PageContentHeader } from '@/base/PageContent';
import { InplaceInput } from '@/base/inplace/InplaceInput';

export function DetailsRoute() {
	const workItemId = getRouteApi('/work/$context/details/$workItemId').useParams({
		select: (params) => params.workItemId as WorkItemId
	});
	const updateWorkItemMutation = useUpdateWorkItemsInHierarchyMutation();
	const workItemQuery = useWorkItemDetailsQuery(workItemId);

	if (workItemQuery.isLoading || !workItemQuery.data) {
		return <WorkItemDetailsSkeleton />
	}

	return (
		<PageContent>
			<PageContentHeader>
				<p className='py-1 text-lg font-semibold tracking-tight'>
					<InplaceInput value={workItemQuery.data.title} onSubmit={newTitle => {
						return updateWorkItemMutation.mutateAsync({
							context: workItemQuery.data.contextYear,
							request: {
								updates: {
									[workItemQuery.data.id]: {
										title: newTitle
									}
								}
							}
						}).then();
					}} />
				</p>
			</PageContentHeader>
			<PageContentContent>
				<WorkItemDetails workItem={workItemQuery.data} />
			</PageContentContent>
		</PageContent>
	)
}
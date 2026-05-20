import { WorkItemId } from '@/models/WorkItem.ts';
import { WorkItemDetails } from '@/core/work-item/details/WorkItemDetails.tsx';
import { useUpdateWorkItemsInHierarchyMutation, useWorkItemDetailsQuery } from '@/api/work-item/work-item-hooks';
import { DialogContent, DialogHeader, DialogTitle } from '@/primitive/components/ui/dialog';
import { Spinner } from '@/primitive/components/ui/spinner';
import { InplaceInput } from '@/base/inplace/InplaceInput';

export function WorkItemDetailsModal({ workItemId }: { workItemId: WorkItemId }) {
	const workItemQuery = useWorkItemDetailsQuery(workItemId);
	const updateWorkItemMutation = useUpdateWorkItemsInHierarchyMutation();

	if (workItemQuery.isLoading || !workItemQuery.data) {
		return <DialogContent>
			<div className="flex justify-center items-center w-full h-16">
				<Spinner />
			</div>
		</DialogContent>;
	}

	return (
		<DialogContent className="sm:max-w-[calc(100%-2rem)] lg:max-w-[50rem]">
			<DialogHeader>
				<DialogTitle>
					<InplaceInput value={workItemQuery.data.title} onSubmit={(newTitle) => {
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
				</DialogTitle>
			</DialogHeader>
			<div className="overflow-y-auto max-h-[70vh]">
				<WorkItemDetails workItem={workItemQuery.data} />
			</div>
		</DialogContent>
	);
}
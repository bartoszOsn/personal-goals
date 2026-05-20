import { WorkItemId } from '@/models/WorkItem.ts';
import { WorkItemDetails } from '@/core/work-item/details/WorkItemDetails.tsx';
import { WorkItemTitleInplace } from '@/core/work-item/inplace/WorkItemTitleInplace';
import { useWorkItemDetailsQuery } from '@/api/work-item/work-item-hooks';
import { DialogContent, DialogHeader, DialogTitle } from '@/primitive/components/ui/dialog';
import { Spinner } from '@/primitive/components/ui/spinner';

export function WorkItemDetailsModal({ workItemId }: { workItemId: WorkItemId }) {
	const workItemQuery = useWorkItemDetailsQuery(workItemId);

	if (workItemQuery.isLoading || !workItemQuery.data) {
		// return <WorkItemModalSkeleton />
		return <Spinner />;
	}

	return (
		<DialogContent className='sm:max-w-[calc(100%-2rem)] lg:max-w-[50rem]'>
			<DialogHeader>
				<DialogTitle>
					<WorkItemTitleInplace workItem={workItemQuery.data}
									 textProps={{ inherit: false, size: 'xl' }}
									 inputProps={{ w: '100%' }} showDialogButton={false} />
				</DialogTitle>
			</DialogHeader>
			<div className='overflow-y-auto max-h-[70vh]'>
				<WorkItemDetails workItem={workItemQuery.data} />
			</div>
		</DialogContent>
	)
}
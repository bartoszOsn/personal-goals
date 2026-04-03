import { WorkItemId } from '@/models/WorkItem.ts';
import { WorkItemModalSkeleton } from '@/core/WorkItemModalSkeleton.tsx';
import { WorkItemDetails } from '@/core/work-item/details/WorkItemDetails.tsx';
import { Modal } from '@mantine/core';
import { WorkItemTitleInplace } from '@/core/work-item/inplace/WorkItemTitleInplace';
import { useWorkItemDetailsQuery } from '@/api/work-item/work-item-hooks';

export function WorkItemDetailsModal({ workItemId }: { workItemId: WorkItemId }) {
	const workItemQuery = useWorkItemDetailsQuery(workItemId);

	if (workItemQuery.isLoading || !workItemQuery.data) {
		return <WorkItemModalSkeleton />
	}

	return (
		<>
			<Modal.Header>
				<Modal.Title flex={1}>
					<WorkItemTitleInplace workItem={workItemQuery.data}
									 textProps={{ inherit: false, size: 'xl' }}
									 inputProps={{ w: '100%' }} showDialogButton={false} />
				</Modal.Title>
				<Modal.CloseButton />
			</Modal.Header>
			<Modal.Body>
				<WorkItemDetails workItem={workItemQuery.data} />
			</Modal.Body>
		</>
	)
}
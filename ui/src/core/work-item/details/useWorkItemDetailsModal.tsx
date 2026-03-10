import { useModals } from '@mantine/modals';
import { WorkItemId } from '@/models/WorkItem.ts';
import { WorkItemDetailsModal } from '@/core/work-item/details/WorkItemDetailsModal.tsx';

export function useWorkItemDetailsModal() {
	const modals = useModals();
	return (workItemId: WorkItemId) => modals.openModal({
		withCloseButton: false,
		size: '100%',
		mih: '100%',
		children: <WorkItemDetailsModal workItemId={workItemId} />
	});
}
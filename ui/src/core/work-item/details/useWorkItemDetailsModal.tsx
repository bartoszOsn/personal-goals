import { WorkItemId } from '@/models/WorkItem.ts';
import { WorkItemDetailsModal } from '@/core/work-item/details/WorkItemDetailsModal.tsx';
import { useDialogManager } from '@/base/dialog-manager/api/useDialogManager';

export function useWorkItemDetailsModal() {
	const { openDialog } = useDialogManager();
	return (workItemId: WorkItemId) => openDialog(<WorkItemDetailsModal workItemId={workItemId} />);
}
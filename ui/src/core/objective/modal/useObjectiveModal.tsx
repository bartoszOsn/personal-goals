import { useModals } from '@mantine/modals';
import { ObjectiveModal } from '@/core/objective/modal/ObjectiveModal.tsx';
import { ObjectiveId } from '@/models/Objective.ts';

export function useObjectiveModal() {
	const modals = useModals();
	return (objectiveId: ObjectiveId) => modals.openModal({
		withCloseButton: false,
		size: '100%',
		mih: '100%',
		children: <ObjectiveModal objectiveId={objectiveId} />
	});
}
import { useModals } from '@mantine/modals';
import { TaskModal } from '@/core/task/TaskModal';

export function useTaskModal() {
	const modals = useModals();
	return (taskId: string) => modals.openModal({
		withCloseButton: false,
		size: '100%',
		mih: '100%',
		children: <TaskModal taskId={taskId} />
	});
}
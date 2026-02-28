import { useModals } from '@mantine/modals';
import { TaskModal } from '@/core/task/TaskModal';
import { TaskId } from '@/models/Task';

export function useTaskModal() {
	const modals = useModals();
	return (taskId: TaskId) => modals.openModal({
		withCloseButton: false,
		size: '100%',
		mih: '100%',
		children: <TaskModal taskId={taskId} />
	});
}
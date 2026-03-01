import { useModals } from '@mantine/modals';
import { TaskModal } from '@/core/task/modal/TaskModal.tsx';
import { TaskId } from '@/models/Task.ts';

export function useTaskModal() {
	const modals = useModals();
	return (taskId: TaskId) => modals.openModal({
		withCloseButton: false,
		size: '100%',
		mih: '100%',
		children: <TaskModal taskId={taskId} />
	});
}
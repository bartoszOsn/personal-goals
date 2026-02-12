import { useGanttContext } from '@/base/gantt/GanttProvider';

export function GanttChart<TData>() {
	const context = useGanttContext<TData>();

	return (
		<svg style={{ flexGrow: 1 }} height="100%">
		</svg>
	);
}
import { useDateRanges } from '@/base/gantt/hooks/useDateRanges.ts';
import { useGanttContext } from '@/base/gantt/GanttProvider.tsx';

export function GanttChartRowLines() {
	const context = useGanttContext();
	const { startDate, endDate, dateToPixelPos } = useDateRanges();

	return context.rows.map(row => (
		<line key={row.id}
			  x1={dateToPixelPos(startDate)}
			  y1={row.top}
			  x2={dateToPixelPos(endDate)}
			  y2={row.top}
			  style={{
				  stroke: 'var(--mantine-color-gray-3)',
				  strokeWidth: 1,
			  }} />
	));
}
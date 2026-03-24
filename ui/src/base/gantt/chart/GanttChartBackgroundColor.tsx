import { useDateRanges } from '@/base/gantt/hooks/useDateRanges.ts';
import { useGanttContext } from '@/base/gantt/GanttProvider.tsx';
import { flatItems } from '@/base/gantt/FlatItems.tsx';

export function GanttChartBackgroundColor() {
	const context = useGanttContext();
	const { startDate, endDate, dateToPixelPos } = useDateRanges();

	return context.rows.map(row => {
		const itemColor = flatItems(context.props.items)
			.find(item => item.id === row.id)?.backgroundColor;

		const fill = itemColor ? `var(--mantine-color-${itemColor}-1)` : 'transparent';

		return (
			<rect key={row.id}
				  x={dateToPixelPos(startDate)}
				  y={row.top}
				  width={dateToPixelPos(endDate) - dateToPixelPos(startDate)}
				  height={row.height}
				  style={{ fill, opacity: 0.5 }} />
		);
	});
}
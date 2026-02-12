import { useGanttContext } from '@/base/gantt/GanttProvider.tsx';
import { useDateRanges } from '@/base/gantt/hooks/useDateRanges.ts';

const yMargin = 4;

export function GanttCharttItemBars() {
	const context = useGanttContext();
	const { dateToPixelPos } = useDateRanges();

	return context.rows.map(row => {
		const item = context.props.items.find(item => item.id === row.id);
		if (!item) {
			return null;
		}

		return (
			<rect x={dateToPixelPos(item.start)}
				  y={row.top + yMargin}
				  width={dateToPixelPos(item.end) - dateToPixelPos(item.start)}
				  height={row.height - yMargin * 2}
				  style={{
					  fill: `var(--mantine-color-${item.color}-5)`,
					  fillOpacity: 0.5,
					  rx: 4
				  }} />
		)
	});
}
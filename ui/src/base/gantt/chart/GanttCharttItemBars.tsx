import { useGanttContext } from '@/base/gantt/GanttProvider.tsx';
import { useDateRanges } from '@/base/gantt/hooks/useDateRanges.ts';

const yMargin = 4;
const dragHandleWidth = 10;

export function GanttCharttItemBars() {
	const context = useGanttContext();
	const { dateToPixelPos } = useDateRanges();

	return context.rows.map(row => {
		const item = context.props.items.find(item => item.id === row.id);
		if (!item) {
			return null;
		}

		const actualEnd = item.end.add({ days: 1 });

		return (
			<>
				<rect x={dateToPixelPos(item.start)}
					  y={row.top + yMargin}
					  width={dateToPixelPos(actualEnd) - dateToPixelPos(item.start)}
					  height={row.height - yMargin * 2}
					  style={{
						  fill: `var(--mantine-color-${item.color}-5)`,
						  rx: 4,
						  cursor: context.props.changeDates ? 'grab' : 'pointer'
					  }} />
				{
					context.props.changeDates && (
						<>
							<rect x={dateToPixelPos(item.start)}
								  y={row.top + yMargin}
								  width={dragHandleWidth}
								  height={row.height - yMargin * 2}
								  style={{
									  fill: 'transparent',
									  cursor: 'w-resize'
								  }} />
							<rect x={dateToPixelPos(actualEnd) - dragHandleWidth}
								  y={row.top + yMargin}
								  width={dragHandleWidth}
								  height={row.height - yMargin * 2}
								  style={{
									  fill: 'transparent',
									  cursor: 'e-resize'
								  }} />
						</>
					)
				}
			</>
		)
	});
}
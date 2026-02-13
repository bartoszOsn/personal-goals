import { useDateRanges } from '@/base/gantt/hooks/useDateRanges.ts';
import { useGanttContext } from '@/base/gantt/GanttProvider';
import { Tooltip } from '@mantine/core';
import { Temporal } from 'temporal-polyfill';

const tooltipMargin = 10;

export function GanttChartTodayLine() {
	const context = useGanttContext();
	const { startDate, endDate, dateToPixelPos} = useDateRanges();
	const today = Temporal.Now.plainDateISO();

	if (Temporal.PlainDate.compare(today, startDate) === -1 || Temporal.PlainDate.compare(today, endDate) === 1) {
		return null;
	}

	return (
		<Tooltip label={`Today (${today.toLocaleString()})`}>
			<g x={dateToPixelPos(today) - tooltipMargin} width={tooltipMargin * 2} y={0} height={context.scrollAreaHeight}>
				<line x1={dateToPixelPos(today)}
					  y1={0}
					  x2={dateToPixelPos(today)}
					  y2={context.scrollAreaHeight}
					  stroke="var(--mantine-color-red-5)"
					  strokeWidth={2} />
				<rect x={dateToPixelPos(today) - tooltipMargin}
					  width={tooltipMargin * 2}
					  y={0}
					  height={context.scrollAreaHeight}
					  fill='transparent' />
			</g>
		</Tooltip>
	)
}
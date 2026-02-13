import { useDateRanges } from '@/base/gantt/hooks/useDateRanges.ts';
import { useGanttContext } from '@/base/gantt/GanttProvider';
import { Tooltip } from '@mantine/core';
import { Temporal } from 'temporal-polyfill';
import { isPlainDate } from '@personal-okr/shared';

const tooltipMargin = 10;

export function GanttChartTodayLine() {
	const context = useGanttContext();
	const { startDate, endDate, dateToPixelPos} = useDateRanges();
	const today = Temporal.Now.plainDateISO();

	if (isPlainDate(today).before(startDate) || isPlainDate(today).after(endDate)) {
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
import { useGanttContext } from '@/base/gantt/GanttProvider.tsx';
import { useDateRanges } from '@/base/gantt/hooks/useDateRanges.ts';
import { isPlainDate } from '@personal-okr/shared';
import { Temporal } from 'temporal-polyfill';

export function GanttChartWeekends() {
	const context = useGanttContext();
	const { startDate, endDate, dateToPixelPos } = useDateRanges();

	const weekendDays: Temporal.PlainDate[] = [];
	for (let i = startDate; isPlainDate(i).beforeOrEqual(endDate); i = i.add({ days: 1 })) {
		if (i.dayOfWeek >= 6) {
			weekendDays.push(i);
		}
	}

	const weekendDayPositions = weekendDays.map(day => {
		const x = dateToPixelPos(day);
		const width = dateToPixelPos(day.add({ days: 1})) - x;
		return ({ x, width });
	});

	if (!context.zoomLevel.showWeekends) {
		return null;
	}

	return (
		<g>
			{weekendDayPositions.map((pos, i) => (
				<rect key={i}
					  x={pos.x}
					  y={0}
					  width={pos.width}
					  height={context.scrollAreaHeight}
					  fill="var(--mantine-color-gray-1)" />
			))}
		</g>
	);
}
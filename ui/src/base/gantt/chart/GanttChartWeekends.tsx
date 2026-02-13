import { useGanttContext } from '@/base/gantt/GanttProvider.tsx';
import { useMemo } from 'react';
import { useDateRanges } from '@/base/gantt/hooks/useDateRanges.ts';
import { isPlainDate } from '@personal-okr/shared';

export function GanttChartWeekends() {
	const context = useGanttContext();
	const { startDate, endDate, dateToPixelPos } = useDateRanges();

	const weekendDays = useMemo(() => {
		const results = [];
		for (let i = startDate; isPlainDate(i).beforeOrEqual(endDate); i = i.add({ days: 1 })) {
			if (i.dayOfWeek >= 6) {
				results.push(i);
			}
		}

		return results;
	}, [startDate, endDate]);
	
	const weekendDayPositions = useMemo(
		() => weekendDays.map(day => {
			const x = dateToPixelPos(day);
			const width = dateToPixelPos(day.add({ days: 1})) - x;
			return ({ x, width });
		}),
		[dateToPixelPos, weekendDays]
	);

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
import { useGanttContext } from '@/base/gantt/GanttProvider.tsx';
import { useCallback, useMemo } from 'react';
import { Temporal } from 'temporal-polyfill';
import { isPlainDate } from '@personal-okr/shared';

export function useDateRanges() {
	const context = useGanttContext();
	const sortedItems = useMemo(
		() => [...context.props.items].sort((a, b) => Temporal.PlainDate.compare(a.start, b.start)),
		[context.props.items]
	);
	const pixelPerMillis = context.zoomLevel.pixelsPerDay / (1000 * 60 * 60 * 24);

	const startDate = useMemo(
		() => sortedItems[0].start.subtract({ days: 10 }),
		[sortedItems]
	);
	const endDate = useMemo(
		() => {
			const lastItemEndDate = sortedItems[sortedItems.length - 1].end;
			const screensEndDate = startDate.add({ milliseconds: context.chartViewportWidth / pixelPerMillis });
			return isPlainDate(lastItemEndDate).after(screensEndDate) ? lastItemEndDate.add({ days: 10 }) : screensEndDate;
		},
		[context.chartViewportWidth, pixelPerMillis, sortedItems, startDate]
	);

	const dateToPixelPos = useCallback((date: Temporal.PlainDate) => {

		return date.since(startDate).total('milliseconds') * pixelPerMillis;
	}, [pixelPerMillis, startDate]);

	return {
		startDate,
		endDate,
		dateToPixelPos
	};
}
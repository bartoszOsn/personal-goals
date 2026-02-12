import { useGanttContext } from '@/base/gantt/GanttProvider.tsx';
import { useCallback, useMemo } from 'react';

export function useDateRanges() {
	const context = useGanttContext();
	const sortedItems = useMemo(
		() => [...context.props.items].sort((a, b) => a.start.getTime() - b.start.getTime()),
		[context.props.items]
	);
	const pixelPerMillis = context.zoomLevel.pixelsPerDay / (1000 * 60 * 60 * 24);

	const startDate = useMemo(
		() => sortedItems[0].start,
		[sortedItems]
	);
	const endDate = useMemo(
		() => {
			const lastItemEndDate = sortedItems[sortedItems.length - 1].end;
			const screensEndDate = new Date(startDate.getTime() + context.chartViewportWidth / pixelPerMillis);
			return lastItemEndDate > screensEndDate ? lastItemEndDate : screensEndDate;
		},
		[context.chartViewportWidth, pixelPerMillis, sortedItems, startDate]
	);

	const dateToPixelPos = useCallback((date: Date) => {
		return (date.getTime() - startDate.getTime()) * pixelPerMillis;
	}, [pixelPerMillis, startDate]);

	return {
		startDate,
		endDate,
		dateToPixelPos
	};
}
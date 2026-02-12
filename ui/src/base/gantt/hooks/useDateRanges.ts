import { useGanttContext } from '@/base/gantt/GanttProvider.tsx';
import { useCallback, useMemo } from 'react';

export function useDateRanges() {
	const context = useGanttContext();
	const sortedItems = useMemo(
		() => [...context.props.items].sort((a, b) => a.start.getTime() - b.start.getTime()),
		[context.props.items]
	);
	const startDate = useMemo(
		() => sortedItems[0].start,
		[sortedItems]
	);
	const endDate = useMemo(
		() => sortedItems[sortedItems.length - 1].end,
		[sortedItems]
	);

	const pixelPerMillis = context.zoomLevel.pixelsPerDay / (1000 * 60 * 60 * 24);

	const dateToPixelPos = useCallback((date: Date) => {
		return (date.getTime() - startDate.getTime()) * pixelPerMillis;
	}, [pixelPerMillis, startDate]);

	return {
		startDate,
		endDate,
		dateToPixelPos
	};
}
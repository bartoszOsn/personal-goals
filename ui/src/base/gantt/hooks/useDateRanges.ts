import { useGanttContext } from '@/base/gantt/GanttProvider.tsx';
import { useCallback, useMemo } from 'react';

const pixelPerDay = 50;
const pixelPerMillis = pixelPerDay / (1000 * 60 * 60 * 24);

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

	const dateToPixelPos = useCallback((date: Date) => {
		return (date.getTime() - startDate.getTime()) * pixelPerMillis;
	}, [startDate]);

	return {
		startDate,
		endDate,
		dateToPixelPos
	};
}
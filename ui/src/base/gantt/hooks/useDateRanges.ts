import { useGanttContext } from '@/base/gantt/GanttProvider.tsx';
import { useCallback, useMemo } from 'react';
import { Temporal } from 'temporal-polyfill';
import { isPlainDate } from '@personal-okr/shared';
import { flatItems } from '@/base/gantt/FlatItems';
import { GanttItem } from '@/base/gantt';

export function useDateRanges() {
	const context = useGanttContext();
	const earliestItem = useMemo(
		() => flatItems(context.props.items)
			.filter((item): item is GanttItem<unknown> & { start: Temporal.PlainDate } => !!item.start)
			.sort((a, b) => Temporal.PlainDate.compare(a.start, b.start))
			.at(0),
		[context.props.items]
	);
	const latestItem = useMemo(
		() => flatItems(context.props.items)
			.filter((item): item is GanttItem<unknown> & { end: Temporal.PlainDate } => !!item.end)
			.sort((a, b) => Temporal.PlainDate.compare(a.end, b.end))
			.at(-1),
		[context.props.items]
	);
	
	const pixelPerMillis = context.zoomLevel.pixelsPerDay / (1000 * 60 * 60 * 24);

	const startDate = useMemo(
		() => earliestItem?.start ?? Temporal.Now.plainDateISO().subtract({ days: 10 }),
		[earliestItem]
	);
	const endDate = useMemo(
		() => {
			const lastItemEndDate = latestItem?.end;
			const screensEndDate = startDate.add({ milliseconds: context.chartViewportWidth / pixelPerMillis });

			if (!lastItemEndDate) {
				return screensEndDate;
			}

			return isPlainDate(lastItemEndDate).after(screensEndDate) ? lastItemEndDate.add({ days: 10 }) : screensEndDate;
		},
		[context.chartViewportWidth, latestItem?.end, pixelPerMillis, startDate]
	);

	const dateToPixelPos = useCallback((date: Temporal.PlainDate) => {
		return date.since(startDate).total('milliseconds') * pixelPerMillis;
	}, [pixelPerMillis, startDate]);

	const pixelPosToDate = useCallback((pixelPos: number) => {
		return startDate.add({ milliseconds: Math.round(pixelPos / pixelPerMillis) });
	}, [startDate, pixelPerMillis]);

	return {
		startDate,
		endDate,
		dateToPixelPos,
		pixelPosToDate
	};
}
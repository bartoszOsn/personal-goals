import { useGanttContext } from '@/base/gantt/GanttProvider.tsx';
import { useCallback, useMemo } from 'react';
import { Temporal } from 'temporal-polyfill';
import { maxPlainDate } from '@personal-okr/shared';
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
		() => {
			let date = Temporal.Now.plainDateISO();

			if (context.props.bounds?.[0]) {
				date = context.props.bounds[0];
			} else if (earliestItem?.start) {
				date = earliestItem.start;
			}

			return date.subtract({ days: 10 });
		},
		[context.props.bounds, earliestItem?.start]
	);
	const endDate = useMemo(
		() => {
			const lastItemEndDate = latestItem?.end.add({ days: 10 });
			const screensEndDate = startDate.add({ milliseconds: context.chartViewportWidth / pixelPerMillis });
			const boundsEndDate = context.props.bounds?.[1].add({ days: 10 });

			if (boundsEndDate) {
				return maxPlainDate(boundsEndDate, screensEndDate);
			}

			if (!lastItemEndDate) {
				return screensEndDate;
			}

			return maxPlainDate(lastItemEndDate, screensEndDate);
		},
		[context.chartViewportWidth, context.props.bounds, latestItem?.end, pixelPerMillis, startDate]
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
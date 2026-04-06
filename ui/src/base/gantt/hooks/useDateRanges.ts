import { GanttContext, useGanttContext } from '@/base/gantt/GanttProvider.tsx';
import { Temporal } from 'temporal-polyfill';
import { maxPlainDate } from '@personal-okr/shared';
import { flatItems } from '@/base/gantt/FlatItems';
import { GanttItem } from '@/base/gantt';

function getStartDate(context: GanttContext<unknown>, earliestItem: GanttItem<unknown> | undefined) {
	let date = Temporal.Now.plainDateISO();

	if (context.props.bounds?.[0]) {
		date = context.props.bounds[0];
	} else if (earliestItem?.start) {
		date = earliestItem.start;
	}

	return date.subtract({ days: 10 });
}

function getEndDate(latestItem: GanttItem<unknown> | undefined, startDate: Temporal.PlainDate, context: GanttContext<unknown>, pixelPerMillis: number) {
	const lastItemEndDate = latestItem?.end?.add({ days: 10 });
	const screensEndDate = startDate.add({ milliseconds: context.chartViewportWidth / pixelPerMillis });
	const boundsEndDate = context.props.bounds?.[1].add({ days: 10 });

	if (boundsEndDate) {
		return maxPlainDate(boundsEndDate, screensEndDate);
	}

	if (!lastItemEndDate) {
		return screensEndDate;
	}

	return maxPlainDate(lastItemEndDate, screensEndDate);
}

export function useDateRanges() {
	const context = useGanttContext();
	const earliestItem = flatItems(context.props.items)
		.filter((item): item is GanttItem<unknown> & { start: Temporal.PlainDate } => !!item.start)
		.sort((a, b) => Temporal.PlainDate.compare(a.start, b.start))
		.at(0);

	const latestItem = flatItems(context.props.items)
		.filter((item): item is GanttItem<unknown> & { end: Temporal.PlainDate } => !!item.end)
		.sort((a, b) => Temporal.PlainDate.compare(a.end, b.end))
		.at(-1);
	
	const pixelPerMillis = context.zoomLevel.pixelsPerDay / (1000 * 60 * 60 * 24);

	const startDate = getStartDate(context, earliestItem);
	const endDate = getEndDate(latestItem, startDate, context, pixelPerMillis);

	const dateToPixelPos = (date: Temporal.PlainDate) => {
		return date.since(startDate).total('milliseconds') * pixelPerMillis;
	}

	const pixelPosToDate = (pixelPos: number) => {
		return startDate.add({ milliseconds: Math.round(pixelPos / pixelPerMillis) });
	}

	return {
		startDate,
		endDate,
		dateToPixelPos,
		pixelPosToDate
	};
}
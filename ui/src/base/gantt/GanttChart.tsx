import { useGanttContext } from '@/base/gantt/GanttProvider';
import { ScrollArea } from '@mantine/core';
import { useEffect, useRef } from 'react';
import { useDateRanges } from '@/base/gantt/hooks/useDateRanges';
import { GanttChartRowLines } from '@/base/gantt/chart/GanttChartRowLines';
import { GanttCharttItemBars } from '@/base/gantt/chart/GanttCharttItemBars';
import { GanttChartTodayLine } from '@/base/gantt/chart/GanttChartTodayLine';
import { GanttChartHeader } from '@/base/gantt/chart/GanttChartHeader';
import { GanttZoomButtons } from '@/base/gantt/chart/GanttZoomButtons';
import { useElementSize } from '@mantine/hooks';
import { GanttChartWeekends } from '@/base/gantt/chart/GanttChartWeekends';
import { GanttChartBackgroundColor } from '@/base/gantt/chart/GanttChartBackgroundColor';

export function GanttChart<TData>() {
	const context = useGanttContext<TData>();
	const { ref: viewportRef, width } = useElementSize<HTMLDivElement>();
	const scrollAreaRef = useRef<HTMLDivElement | null>(null);
	const { dateToPixelPos, endDate } = useDateRanges();

	useEffect(() => {
		return context.subscribeToScrollY(y => {
			if (!viewportRef.current) {
				return;
			}

			viewportRef.current.scrollTo({ left: viewportRef.current.scrollLeft, top: y, behavior: 'instant' });
		})
	}, [context, viewportRef]);

	useEffect(() => {
		context.setChartViewportWidth(width);
	}, [context, width]);
	
	useEffect(() => {
		return context.subscribeToTableToChartRatio(ratio => {
			if (!scrollAreaRef.current) {
				return;
			}
			
			scrollAreaRef.current.style.flex = `${(1 - ratio) * 100} 0 0px`;
		})
	}, [context])

	return (
		<ScrollArea.Autosize ref={scrollAreaRef}
							 h="100%"
							 styles={{ root: { height: '100%' } }}
							 viewportRef={viewportRef}
							 viewportProps={{ style: { height: '100%' } }}
							 onScrollPositionChange={({ y }) => context.setScrollY(y)}>
			{/* eslint-disable-next-line react-hooks/refs */}
			<svg ref={context.svg} height={context.scrollAreaHeight} width={dateToPixelPos(endDate)}>
				<GanttChartWeekends />
				<GanttChartBackgroundColor />
				<GanttChartRowLines />
				<GanttChartTodayLine />
				<GanttCharttItemBars />
				<GanttChartHeader />
			</svg>
			<GanttZoomButtons />
		</ScrollArea.Autosize>
	);
}
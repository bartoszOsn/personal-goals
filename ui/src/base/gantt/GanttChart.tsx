import { useGanttContext } from '@/base/gantt/GanttProvider';
import { ScrollArea } from '@mantine/core';
import { useEffect, useRef } from 'react';
import { useDateRanges } from '@/base/gantt/hooks/useDateRanges';
import { GanttChartRowLines } from '@/base/gantt/chart/GanttChartRowLines';
import { GanttCharttItemBars } from '@/base/gantt/chart/GanttCharttItemBars';

export function GanttChart<TData>() {
	const context = useGanttContext<TData>();
	const viewportRef = useRef<HTMLDivElement>(null);
	const { dateToPixelPos, endDate } = useDateRanges();

	useEffect(() => {
		if (!viewportRef.current) {
			return;
		}

		viewportRef.current.scrollTo({ left: viewportRef.current.scrollLeft, top: context.scrollY, behavior: 'instant'});
	}, [context.scrollY]);

	return (
		<ScrollArea style={{ flexGrow: 1 }} h="100%" viewportRef={viewportRef} onScrollPositionChange={({ y }) => context.setScrollY(y)}>
			<svg height={context.scrollAreaHeight} width={dateToPixelPos(endDate)}>
				<GanttChartRowLines />
				<GanttCharttItemBars />
			</svg>
		</ScrollArea>
	);
}
import { useGanttContext } from '@/base/gantt/GanttProvider';
import { ScrollArea } from '@mantine/core';
import { useEffect, useRef } from 'react';

export function GanttChart<TData>() {
	const context = useGanttContext<TData>();
	const viewportRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!viewportRef.current) {
			return;
		}

		viewportRef.current.scrollTo({ left: viewportRef.current.scrollLeft, top: context.scrollY, behavior: 'instant'});
	}, [context.scrollY]);

	return (
		<ScrollArea style={{ flexGrow: 1 }} h="100%" viewportRef={viewportRef} onScrollPositionChange={({ y }) => context.setScrollY(y)}>
			<svg height={context.scrollAreaHeight}>
			</svg>
		</ScrollArea>
	);
}
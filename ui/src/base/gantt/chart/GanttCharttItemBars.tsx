import { useGanttContext } from '@/base/gantt/GanttProvider.tsx';
import { useDateRanges } from '@/base/gantt/hooks/useDateRanges.ts';
import type { GanttItem } from '@/base/gantt';
import type { RowPositionInfo } from '@/base/gantt/model/RowPositionInfo';
import { useDrag } from '@/base/gantt/hooks/useDrag';

const yMargin = 4;
const dragHandleWidth = 10;

export function GanttCharttItemBars() {
	const context = useGanttContext();

	return context.rows.map(row => {
		const item = context.props.items.find(item => item.id === row.id);

		if (!item) {
			return null;
		}

		return <Bar item={item} row={row} />;
	});
}

function Bar({ item, row }: { item: GanttItem<unknown>, row: RowPositionInfo }) {
	const context = useGanttContext();
	const { dateToPixelPos, pixelPosToDate } = useDateRanges();
	const startDrag = useDrag();

	let actualStart = item.start;
	let actualEnd = item.end.add({ days: 1 });

	if ('draggedItems' in context.dragData && context.dragData.draggedItems.includes(item)) {
		if (context.dragData.status === 'dragging' || context.dragData.status === 'dragging-left') {
			actualStart = actualStart.add(context.dragData.current.since(context.dragData.start));
		}
		if (context.dragData.status === 'dragging' || context.dragData.status === 'dragging-right') {
			actualEnd = actualEnd.add(context.dragData.current.since(context.dragData.start));
		}
	}

	const getDragItems = () => {
		if (context.props.selectedItemIds?.includes(item.id)) {
			return context.props.selectedItemIds.map(id => context.props.items.find(item => item.id === id)!);
		} else {
			return [context.props.items.find(i => i.id === item.id)!];
		}
	}

	const onMouseDownMain = (e: React.MouseEvent) => {
		e.stopPropagation();
		const x = e.clientX - context.svg.current!.getBoundingClientRect().x;
		const xDate = pixelPosToDate(x);
		startDrag(xDate, getDragItems(), 'dragging');
	};

	const onMouseDownLeft = (e: React.MouseEvent) => {
		e.stopPropagation();
		const x = e.clientX - context.svg.current!.getBoundingClientRect().x;
		const xDate = pixelPosToDate(x);
		startDrag(xDate, getDragItems(), 'dragging-left');
	}

	const onMouseDownRight = (e: React.MouseEvent) => {
		e.stopPropagation();
		const x = e.clientX - context.svg.current!.getBoundingClientRect().x;
		const xDate = pixelPosToDate(x);
		startDrag(xDate, getDragItems(), 'dragging-right');
	}

	return (
		<>
			<rect x={dateToPixelPos(actualStart)}
				  y={row.top + yMargin}
				  width={dateToPixelPos(actualEnd) - dateToPixelPos(actualStart)}
				  height={row.height - yMargin * 2}
				  onMouseDown={onMouseDownMain}
				  style={{
					  fill: `var(--mantine-color-${item.color}-3)`,
					  rx: 4,
					  cursor: context.props.changeDates ? 'grab' : 'pointer'
				  }} />
			{
				context.props.changeDates && (
					<>
						<rect x={dateToPixelPos(actualStart) - dragHandleWidth}
							  y={row.top + yMargin}
							  width={dragHandleWidth}
							  height={row.height - yMargin * 2}
							  onMouseDown={onMouseDownLeft}
							  style={{
								  fill: 'transparent',
								  cursor: 'w-resize'
							  }} />
						<rect x={dateToPixelPos(actualEnd)}
							  y={row.top + yMargin}
							  width={dragHandleWidth}
							  height={row.height - yMargin * 2}
							  onMouseDown={onMouseDownRight}
							  style={{
								  fill: 'transparent',
								  cursor: 'e-resize'
							  }} />
					</>
				)
			}
			{
				context.dragData.status === 'resolving' && context.dragData.optimisticDates.has(item.id) && (
					<rect x={dateToPixelPos(context.dragData.optimisticDates.get(item.id)!.startDate)}
						  y={row.top + yMargin}
						  width={dateToPixelPos(context.dragData.optimisticDates.get(item.id)!.endDate) - dateToPixelPos(context.dragData.optimisticDates.get(item.id)!.startDate)}
						  height={row.height - yMargin * 2}
						  style={{
							  fill: `var(--mantine-color-${item.color}-3)`,
							  rx: 4,
							  opacity: 0.5
						  }} />
				)
			}
		</>
	)
}
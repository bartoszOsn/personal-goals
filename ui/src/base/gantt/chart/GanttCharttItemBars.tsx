import { useGanttContext } from '@/base/gantt/GanttProvider.tsx';
import { useDateRanges } from '@/base/gantt/hooks/useDateRanges.ts';
import { GanttItem } from '@/base/gantt';
import { RowPositionInfo } from '@/base/gantt/model/RowPositionInfo';
import { useDrag } from '@/base/gantt/hooks/useDrag';
import { flatItems } from '@/base/gantt/FlatItems';
import { Tooltip } from '@mantine/core';

const yMargin = 4;
const dragHandleWidth = 10;
const ONE_DATE_BAR_WIDTH = 100;

export function GanttCharttItemBars() {
	const context = useGanttContext();
	const flattenedItems = flatItems(context.props.items);

	return (
		<>
			{
				context.rows.map(row => {
					const item = flattenedItems.find(item => item.id === row.id);

					if (!item) {
						return null;
					}

					return <Bar key={item.id} item={item} row={row} />;
				})
			}
		</>
	)
}

function Bar({ item, row }: { item: GanttItem<unknown>, row: RowPositionInfo }) {
	const context = useGanttContext();
	const { dateToPixelPos, pixelPosToDate } = useDateRanges();
	const startDrag = useDrag();

	let actualStart = item.start;
	let actualEnd = item.end?.add({ days: 1 });

	if ('draggedItems' in context.dragData && context.dragData.draggedItems.includes(item)) {
		if (context.dragData.status === 'dragging' || context.dragData.status === 'dragging-left') {
			actualStart = actualStart?.add(context.dragData.current.since(context.dragData.start));
		}
		if (context.dragData.status === 'dragging' || context.dragData.status === 'dragging-right') {
			actualEnd = actualEnd?.add(context.dragData.current.since(context.dragData.start));
		}
	}

	const getDragItems = () => {
		if (context.selectedItemIdsRef.current.includes(item.id)) {
			return context.selectedItemIdsRef.current.map(id => context.flattenedItems.find(item => item.id === id)!);
		} else {
			return [context.flattenedItems.find(i => i.id === item.id)!];
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


	if (!actualStart && !actualEnd) {
		return null;
	}

	const x = actualStart
	? dateToPixelPos(actualStart)
		: dateToPixelPos(actualEnd!) - ONE_DATE_BAR_WIDTH;

	const width = actualEnd
		? dateToPixelPos(actualEnd) - x
		: ONE_DATE_BAR_WIDTH;

	const transparent = `color(from var(--mantine-color-${item.color}-3) srgb r g b / 0)`;
	const startColor = actualStart ? `var(--mantine-color-${item.color}-3)` : transparent;
	const endColor = actualEnd ? `var(--mantine-color-${item.color}-3)` : transparent;

	const id = `${context.props.ganttKey}-bar-item-fill-gradient-${item.id}`;

	return (
		<>
			<defs>
				<linearGradient x1="0%" y1="0%" x2="100%" y2="0%" id={id}>
					<stop offset="0%" style={{ stopColor: startColor}} />
					<stop offset="100%" style={{ stopColor: endColor}} />
				</linearGradient>
			</defs>
			<Tooltip.Floating disabled={item.tooltip === undefined} label={item.tooltip ?? ''}>
				<rect x={x}
					  y={row.top + yMargin}
					  width={width}
					  height={row.height - yMargin * 2}
					  onMouseDown={onMouseDownMain}
					  style={{
						  fill: `url(#${id})`,
						  rx: 4,
						  cursor: context.props.changeDates ? 'grab' : 'pointer',
					  }} />
			</Tooltip.Floating>
			{
				context.props.changeDates && actualStart && actualEnd && (
					<>
						<rect x={x - dragHandleWidth}
							  y={row.top + yMargin}
							  width={dragHandleWidth}
							  height={row.height - yMargin * 2}
							  onMouseDown={onMouseDownLeft}
							  style={{
								  fill: 'transparent',
								  cursor: 'w-resize'
							  }} />
						<rect x={x + width}
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
import { useGanttContext } from '@/base/gantt/GanttProvider.tsx';
import { Temporal } from 'temporal-polyfill';
import { GanttItem } from '@/base/gantt';
import { DragData } from '@/base/gantt/model/DragData.ts';
import { useDateRanges } from '@/base/gantt/hooks/useDateRanges';
import { GanttNewItemDates } from '@/base/gantt/model/GanttNewItemDates';

export function useDrag() {
	const context = useGanttContext();
	const { pixelPosToDate } = useDateRanges();

	const startDrag = (startPos: Temporal.PlainDate, items: GanttItem<unknown>[], type: 'dragging' | 'dragging-left' | 'dragging-right') => {
		if (context.dragData.status !== 'idle') {
			return;
		}

		let newDragData: DragData = {
			status: type,
			start: startPos,
			current: startPos,
			draggedItems: items
		};
		context.setDragData(newDragData);

		const onMouseMove = (e: MouseEvent) => {
			e.preventDefault();
			const pos = pixelPosToDate(e.clientX - context.svg.current!.getBoundingClientRect().x);
			newDragData = {
				...newDragData,
				status: type,
				current: pos
			} as DragData;
			context.setDragData(newDragData);
		}

		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', (e: MouseEvent) => {
			window.removeEventListener('mousemove', onMouseMove);
			const pos = pixelPosToDate(e.clientX - context.svg.current!.getBoundingClientRect().x);
			if (newDragData.status !== type) {
				return;
			}
			const diff = pos.since(newDragData.start);
			const optimisticDates: Map<string, GanttNewItemDates> = new Map(
				newDragData.draggedItems
					.filter((item): item is GanttItem<unknown> & Required<Pick<GanttItem<unknown>, 'start' | 'end'>> => !!item.start && !!item.end)
					.map(item => [item.id, {
					startDate: type === 'dragging' || type === 'dragging-left' ? item.start.add(diff) : item.start,
					endDate: type === 'dragging' || type === 'dragging-right' ? item.end.add(diff) : item.end,
				}] as const)
			);

			context.setDragData({
				status: 'resolving',
				optimisticDates
			});
			context.props.changeDates?.(optimisticDates).finally(() => {
				context.setDragData({ status: 'idle' });
			})
		}, { once: true });
	}

	return startDrag;
}
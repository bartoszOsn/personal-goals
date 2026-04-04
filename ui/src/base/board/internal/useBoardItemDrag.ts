import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';

type DragData<TData, TColumnId> = null
	| {
	item: TData;
	pageX: number;
	pageY: number;
	offsetX: number;
	offsetY: number;
	initialColumn: TColumnId;
	width: number;
} | {
	changingColumn: true
};

export function useBoardItemDrag<TData, TColumnId>(onColumnChange: (item: TData, columnId: TColumnId) => void | Promise<void>) {
	const [dragData, setDragData] = useState<DragData<TData, TColumnId>>(null);

	const onMouseMove = useCallback((e: MouseEvent) => {
		setDragData(prev => {
			if (!prev || 'changingColumn' in prev) {
				return prev;
			}

			return ({
				...prev,
				pageX: e.pageX,
				pageY: e.pageY
			});
		});
	}, []);

	const onMouseUpOnWindow = useCallback(() => {
		window.removeEventListener('mousemove', onMouseMove);
		setDragData(null);
	}, [onMouseMove]);
	
	const overlayDraggedItem = useMemo(() => {
		if (!dragData || 'changingColumn' in dragData) {
			return null;
		}

		return {
			item: dragData.item,
			x: dragData.pageX - dragData.offsetX,
			y: dragData.pageY - dragData.offsetY,
			initialColumn: dragData.initialColumn,
			width: dragData.width,
		};
	}, [dragData])

	return {
		isDragging: !!dragData && 'item' in dragData,
		isChangingColumn: !!dragData && 'changingColumn' in dragData,
		overlayDraggedItem: overlayDraggedItem,
		onMouseDownOnHandle: (item: TData, initialColumn: TColumnId, e: React.MouseEvent) => {
			e.preventDefault();
			const boundingClientRect = e.currentTarget.getBoundingClientRect();
			setDragData({
				item: item,
				pageX: e.pageX,
				pageY: e.pageY,
				offsetX: e.pageX - boundingClientRect.left,
				offsetY: e.pageY - boundingClientRect.top,
				initialColumn: initialColumn,
				width: boundingClientRect.width,
			});
			
			window.addEventListener('mousemove', onMouseMove);
			window.addEventListener('mouseup', onMouseUpOnWindow);
		},
		onMouseUpOnTarget: (columnId: TColumnId) => {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUpOnWindow);

			if (!dragData || 'changingColumn' in dragData) {
				return;
			}

			setDragData({
				changingColumn: true
			});
			Promise.resolve(onColumnChange(dragData.item, columnId))
			.then(() => {
				setDragData(null);
			})
		}
	};
}
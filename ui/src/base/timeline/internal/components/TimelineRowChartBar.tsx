import { ReactNode, useEffect, useRef } from 'react';
import { Temporal } from 'temporal-polyfill';
import { timelineScaleToPxPerDay } from '@/base/timeline/internal/timelineScaleToPx.ts';
import { plainDateToPxOffset, pxOffsetToPlainDate } from '@/base/timeline/internal/plainDateToPxOffset.ts';
import { durationToPx } from '@/base/timeline/internal/durationToPx.ts';

export function TimelineRowChartBar(
	{ children, posStart, posEnd, startDate, scale, onDatesChange }:
	{
		children: ReactNode,
		posStart: Temporal.PlainDate,
		posEnd: Temporal.PlainDate,
		startDate: Temporal.PlainDate,
		scale: keyof typeof timelineScaleToPxPerDay,
		onDatesChange: (newStart: Temporal.PlainDate, newEnd: Temporal.PlainDate) => void,
	}
) {
	const left = plainDateToPxOffset(posStart, scale, startDate);
	const width = durationToPx(posStart.until(posEnd), scale);

	const barRef = useRef<HTMLDivElement>(null);
	const leftHandleRef = useRef<HTMLDivElement>(null);
	const rightHandleRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!barRef.current || !leftHandleRef.current || !rightHandleRef.current) {
			return;
		}

		const bar = barRef.current;
		const leftHandle = leftHandleRef.current;
		const rightHandle = rightHandleRef.current;
		
		let initialDragInfo: null | { mouseX: number; left: number; width: number; change: 'start' | 'end' | 'both' } = null;

		const createMouseDown = (change: 'start' | 'end' | 'both') => (e: MouseEvent) => {
			initialDragInfo = { mouseX: e.pageX, left: left, width: width, change };
			document.addEventListener('mousemove', mouseMove);
			document.addEventListener('mouseup', mouseUp);
			e.stopPropagation();
			e.preventDefault();
		}

		const mouseMove = (e: MouseEvent) => {
			if (!initialDragInfo || !bar) return;

			const delta = e.pageX - initialDragInfo.mouseX;

			let newLeft: number;
			let newWidth: number;
			switch (initialDragInfo.change) {
				case 'start': {
					newLeft = initialDragInfo.left + delta;
					newWidth = initialDragInfo.width - delta;
					break;
				}
				case 'both': {
					newLeft = initialDragInfo.left + delta;
					newWidth = initialDragInfo.width;
					break;
				}
				case 'end': {
					newLeft = initialDragInfo.left;
					newWidth = initialDragInfo.width + delta;
					break;
				}
			}

			bar.style.left = `${newLeft}px`;
			bar.style.width = `${newWidth}px`;
		}

		const mouseUp = (e: MouseEvent) => {
			document.removeEventListener('mousemove', mouseMove);
			document.removeEventListener('mouseup', mouseUp);

			if (!initialDragInfo) return;

			const delta = e.clientX - initialDragInfo.mouseX;

			let newLeft: number;
			let newWidth: number;
			switch (initialDragInfo.change) {
				case 'start': {
					newLeft = initialDragInfo.left + delta;
					newWidth = initialDragInfo.width - delta;
					break;
				}
				case 'both': {
					newLeft = initialDragInfo.left + delta;
					newWidth = initialDragInfo.width;
					break;
				}
				case 'end': {
					newLeft = initialDragInfo.left;
					newWidth = initialDragInfo.width + delta;
					break;
				}
			}

			const newPosStart = pxOffsetToPlainDate(newLeft, scale, startDate);
			const newPosEnd = pxOffsetToPlainDate(newLeft + newWidth, scale, startDate);

			onDatesChange(newPosStart, newPosEnd);
		}
		
		const barMouseDown = createMouseDown('both');
		const leftHanddleMouseDown = createMouseDown('start');
		const rightHanddleMouseDown = createMouseDown('end');

		bar.addEventListener('mousedown', barMouseDown);
		leftHandle.addEventListener('mousedown', leftHanddleMouseDown);
		rightHandle.addEventListener('mousedown', rightHanddleMouseDown);
		
		return () => {
			bar.removeEventListener('mousedown', barMouseDown);
			leftHandle.removeEventListener('mousedown', leftHanddleMouseDown);
			rightHandle.removeEventListener('mousedown', rightHanddleMouseDown);
			document.removeEventListener('mousemove', mouseMove);
			document.removeEventListener('mouseup', mouseUp);
		}
	}, [left, onDatesChange, scale, startDate, width]);


	return (
		<div ref={barRef} className='group/TimelineRowChartBar h-6 bg-background border rounded absolute top-1/2 -translate-y-1/2 cursor-grab' style={{ left, width }}>
			{children}
			<div ref={leftHandleRef} className='absolute w-2 h-full -left-2 border-l-3 cursor-w-resize opacity-30 group-hover/TimelineRowChartBar:opacity-100 transition-opacity duration-300' />
			<div ref={rightHandleRef} className='absolute w-2 h-full -right-2 border-r-3 cursor-w-resize opacity-30 group-hover/TimelineRowChartBar:opacity-100 transition-opacity duration-300' />
		</div>
	)
}
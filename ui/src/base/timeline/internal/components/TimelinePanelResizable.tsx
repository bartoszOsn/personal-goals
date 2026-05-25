import { useIsMobile } from '@/primitive/hooks/use-mobile.ts';
import { Separator } from '@/primitive/components/ui/separator';
import { useEffect, useEffectEvent, useRef } from 'react';
import { timelineTableWidthCssPropertyName } from '@/base/timeline/internal/timelineTableWidthCssPropertyName';

export function TimelinePanelResizable({
	getOffset,
	setOffset
}: {
	getOffset: () => number;
	setOffset: (offset: number) => void;
}) {
	const isMobile = useIsMobile();
	const ref = useRef<HTMLDivElement | null>(null);

	const getOffsetEvent = useEffectEvent(getOffset);
	const setOffsetEvent = useEffectEvent(setOffset);

	useEffect(() => {
		if (!ref.current) return;

		const elem = ref.current;

		let startState: null | { offset: number, mousePos: number } = null;

		const mouseDown = (e: MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			startState = { offset: getOffsetEvent(), mousePos: e.pageX };
			document.addEventListener('mousemove', mouseMove, { passive: true });
			document.addEventListener('mouseup', mouseUp);
			document.addEventListener('mouseleave', mouseUp);
			document.removeEventListener('blur', mouseUp);
		};

		const mouseMove = (e: MouseEvent) => {
			if (!startState) return;

			const delta = e.pageX - startState.mousePos;
			setOffsetEvent(startState.offset + delta);
			e.stopPropagation();
		};

		const mouseUp = () => {
			document.removeEventListener('mousemove', mouseMove);
		};

		elem.addEventListener('mousedown', mouseDown);

		return () => {
			elem.removeEventListener('mousemove', mouseMove);
			document.removeEventListener('mouseup', mouseUp);
			document.removeEventListener('mouseleave', mouseUp);
			document.removeEventListener('blur', mouseUp);
		};
	}, [ref, isMobile]);

	if (isMobile) {
		return null;
	}

	return (
		<div className="absolute inset-0 pointer-events-none">
			<div ref={ref} className="sticky h-full w-3 z-30 flex items-center justify-center cursor-ew-resize pointer-events-auto left" style={{ left: `calc(var(${timelineTableWidthCssPropertyName}) - 6px)` }}>
				<Separator orientation="vertical" className="absolute top-0 bottom-0" />
				<div className="z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border" />
			</div>
		</div>
	);
}
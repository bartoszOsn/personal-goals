import { ReactNode, useEffect, useRef } from 'react';
import { Slot } from 'radix-ui';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { autoScrollForElements, autoScrollWindowForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';

export function DragAutoScroll({
	children,
	allowedAxis = 'all'
}: {
	children: ReactNode,
	allowedAxis?: AllowedAxis
}) {
	const ref = useRef<HTMLElement>(null);

	useEffect(() => {
		if (!ref.current) {
			return;
		}

		return combine(
			autoScrollForElements({
				element: ref.current,
				getAllowedAxis: () => allowedAxis
			}),
			autoScrollWindowForElements()
		)
	}, [allowedAxis]);

	return (
		<Slot.Root ref={ref}>
			{children}
		</Slot.Root>
	)
}

export type AllowedAxis = ReturnType<NonNullable<Parameters<typeof autoScrollForElements>[0]['getAllowedAxis']>>;
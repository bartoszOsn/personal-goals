import { ReactNode, useEffect, useRef } from 'react';
import { Slot } from 'radix-ui';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { autoScrollForElements, autoScrollWindowForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';

export function DragAutoScroll({
	children
}: {
	children: ReactNode
}) {
	const ref = useRef<HTMLElement>(null);

	useEffect(() => {
		if (!ref.current) {
			return;
		}

		return combine(
			autoScrollForElements({
				element: ref.current,
			}),
			autoScrollWindowForElements()
		)
	}, []);

	return (
		<Slot.Root ref={ref}>
			{children}
		</Slot.Root>
	)
}
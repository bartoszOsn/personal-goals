import { ReactNode } from 'react';
import { Slot } from 'radix-ui';

export function DragHandle({ asChild, children }: { asChild?: boolean, children: ReactNode }) {
	const Comp = asChild ? Slot.Root : "div";

	return (
		<Comp data-drag-handle>
			{children}
		</Comp>
	);
}
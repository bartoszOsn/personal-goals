import { DragAndDropContext } from '@/base/dnd/api/createDragAndDropContext.ts';
import { useMonitorDrag } from '@/base/dnd/api/useMonitorDrag.ts';
import { useState } from 'react';
import { cn } from '@/primitive/lib/utils.ts';

export function LineDropIndicator<TDragPayload, TDropPayload>(
	{
		isVisible,
		context
	}: {
		isVisible: (dragPayload: TDragPayload, dropPayload: TDropPayload) => boolean,
		context: DragAndDropContext<TDragPayload, TDropPayload>
	}
) {
	const [visible, setVisible] = useState(false);
	useMonitorDrag(context, (drag, drop) => {
		if (!drag || !drop) {
			setVisible(false);
			return;
		}

		setVisible(isVisible(drag, drop));
	})

	return (
		<div className={cn('w-full h-px bg-accent-foreground relative flex items-center before:w-1 before:h-1 before:bg-accent-foreground before:rounded-full', { 'opacity-0': !visible})} />
	)
}
import { Key, ReactNode } from 'react';
import { isChild, TimelineRowData } from '@/base/timeline/internal/TimelineRowData';
import { Draggable } from '@/base/dnd/api/Draggable';
import { getTimelineDnDContext } from '@/base/timeline/internal/timelineDnDContext';
import { Droppable } from '@/base/dnd/api/Droppable';
import { createHitboxMatcher } from '@/base/pragmatic-dnd-x/crateHitboxMatcher';
import { useDragPayload } from '@/base/dnd/api/useDragPayload';

export function TimelineRow<TId extends Key, TData>({
	children,
	isSelected,
	onClick,
	row,
	canBeParent,
	movePending
}: {
	children: ReactNode,
	isSelected: boolean;
	onClick: (withShift: boolean) => void;
	row: TimelineRowData<TId, TData>;
	canBeParent: (childCandidate: TData, parentCandidate: TData) => boolean;
	movePending: boolean
}) {
	const dragged = useDragPayload(getTimelineDnDContext<TId, TData>());
	const canBeDropTarget = !dragged || dragged.id !== row.id && !isChild(dragged, row);

	return (
		<Droppable context={getTimelineDnDContext<TId, TData>()}
				   withBorderIndicator={false}
				   canDrop={(dragPayload) => dragPayload.id !== row.id && !isChild(dragPayload, row)}
				   getData={(dragPayload, dropTargetElement, input) => {
					   if (dragPayload.id === row.id) {
						   return null;
					   }

					   if (isChild(dragPayload, row)) {
						   return null;
					   }

					   const matchHitbox =
						   canBeParent(dragPayload.item.data, row.item.data)
							   ? createHitboxMatcher({
								   top: {
									   top: 0,
									   left: 0,
									   right: 0,
									   bottom: { percent: 70 }
								   },
								   middle: {
									   top: { percent: 30 },
									   bottom: { percent: 30 },
									   left: 0,
									   right: 0
								   },
								   bottom: {
									   top: { percent: 70 },
									   left: 0,
									   right: 0,
									   bottom: 0
								   }
							   })
							   : createHitboxMatcher({
								   top: {
									   top: 0,
									   left: 0,
									   right: 0,
									   bottom: { percent: 50 }
								   },
								   bottom: {
									   top: { percent: 50 },
									   left: 0,
									   right: 0,
									   bottom: 0
								   }
							   });

					   const hitbox = matchHitbox(dropTargetElement, input);
					   switch (hitbox) {
						   case 'top':
							   return { dropAbove: row, dropInto: row.parent };
						   case 'middle':
							   return { dropInto: row, dropBelow: row.children.length > 0 ? row.children.at(-1) : undefined };
						   case 'bottom': {
							   if (!row.collapsed && row.children.length > 0) {
								   return { dropAbove: row.children.at(0), dropInto: row };
							   }

							   return { dropBelow: row, dropInto: row.parent };
						   }
						   case null:
							   return null;
					   }
				   }} isSticky={false}>
			<Draggable context={getTimelineDnDContext<TId, TData>()} data={row} canDrag={!movePending}>
				<div
					className={`group/timelineRow relative not-last:border-b flex flex-row flex-nowrap bg-accent min-h-8 ${isSelected ? 'bg-input' : ''} ${!canBeDropTarget ? 'opacity-50' : ''}`}
					onClick={(e) => {
						onClick(e.shiftKey);
						e.preventDefault();
						e.stopPropagation();
					}}
				>
					{children}
				</div>
			</Draggable>
		</Droppable>
	);
}
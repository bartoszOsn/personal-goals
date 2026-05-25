import { Key, ReactNode } from 'react';
import { timelineTableWidthCssPropertyName } from '@/base/timeline/internal/timelineTableWidthCssPropertyName.ts';
import { ChevronDownIcon, ChevronRightIcon, GripVerticalIcon } from 'lucide-react';
import { Button } from '@/primitive/components/ui/button';
import { TimelineRowData } from '@/base/timeline/internal/TimelineRowData';
import { cn } from '@/primitive/lib/utils';
import { DragHandle } from '@/base/dnd/api/DragHandle';
import { useDropTarget } from '@/base/dnd/api/useDropTarget';
import { getTimelineDnDContext } from '@/base/timeline/internal/timelineDnDContext';
import { Spinner } from '@/primitive/components/ui/spinner';
import { LineDropIndicator } from '@/base/dnd/api/LineDropIndicator';
import { useIsMobile } from '@/primitive/hooks/use-mobile';

export function TimelineRowCell<TId extends Key, TData>(
	{ children, row, onChevronClick, isSelected, showDragHandle, movePending }:
	{
		children?: ReactNode,
		row: TimelineRowData<TId, TData>,
		onChevronClick: () => void, isSelected: boolean,
		showDragHandle: boolean,
		movePending: boolean,
	}
) {
	const isMobile = useIsMobile();
	const dropTarget = useDropTarget(getTimelineDnDContext<TId, TData>());
	const isDropInto = dropTarget && dropTarget.dropInto && dropTarget.dropInto.id === row.id;

	return (
		<div className={cn("sticky left-0 border-r border-l-4 border-l-transparent border-b bg-background z-10 flex flex-row flex-nowrap", { 'border-l-accent-foreground': isSelected })}
			 style={{
				 ...(
					 isMobile
					 	? {
							width: '100%',
						 }
					    : {
							 width: `var(${timelineTableWidthCssPropertyName})`
						 }
				 ),
				 paddingLeft: row.level * 20 }}>
			{
				showDragHandle && <DragHandle asChild>
					<Button variant="ghost"
							size="icon-xs"
							className="self-center opacity-10 group-hover/timelineRow:opacity-100"
							onClick={onChevronClick}>
						{
							movePending
								? <Spinner />
								: <GripVerticalIcon />
						}
					</Button>
				</DragHandle>
			}
			<Button variant="ghost"
					size="icon"
					className={cn('self-center', { 'invisible': row.children.length === 0,  'visible border-accent-foreground': isDropInto })}
					onClick={onChevronClick}>
				{
					row.collapsed
						? <ChevronRightIcon />
						: <ChevronDownIcon />
				}
			</Button>
			<div className="flex-1 overflow-hidden">
				{children}
			</div>
			<div className="absolute inset-0 z-20 pointer-events-none">
				<LineDropIndicator isVisible={(_dragPayload, dropPayload) => !!dropPayload && !!dropPayload.dropAbove && dropPayload.dropAbove.id === row.id}
								   context={getTimelineDnDContext<TId, TData>()}
								   className="absolute! top-0 left-0 right-0 z-20"
				/>
				<LineDropIndicator isVisible={(_dragPayload, dropPayload) => !!dropPayload && !!dropPayload.dropBelow && dropPayload.dropBelow.id === row.id}
								   context={getTimelineDnDContext<TId, TData>()}
								   className="absolute! bottom-0 left-0 right-0 z-20"
				/>
			</div>
		</div>
	);
}
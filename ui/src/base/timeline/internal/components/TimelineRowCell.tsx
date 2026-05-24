import { Key, ReactNode } from 'react';
import { timelineTableWidthCssPropertyName } from '@/base/timeline/internal/timelineTableWidthCssPropertyName.ts';
import { ChevronDownIcon, ChevronRightIcon, GripVerticalIcon } from 'lucide-react';
import { Button } from '@/primitive/components/ui/button';
import { TimelineRowData } from '@/base/timeline/internal/TimelineRowData';
import { cn } from '@/primitive/lib/utils';
import { DragHandle } from '@/base/dnd/api/DragHandle';
import { useDropTarget } from '@/base/dnd/api/useDropTarget';
import { getTimelineDnDContext } from '@/base/timeline/internal/timelineDnDContext';

export function TimelineRowCell<TId extends Key, TData>(
	{ children, row, onChevronClick, isSelected, showDragHandle }:
	{
		children?: ReactNode,
		row: TimelineRowData<TId, TData>,
		onChevronClick: () => void, isSelected: boolean,
		showDragHandle: boolean
	}
) {
	const dropTarget = useDropTarget(getTimelineDnDContext<TId, TData>());
	const isDropInto = dropTarget && dropTarget.dropInto && dropTarget.dropInto.id === row.id;

	return (
		<div className={cn("sticky left-0 border-r bg-background z-10 flex flex-row flex-nowrap overflow-hidden", { 'bg-muted': isSelected })}
			 style={{ width: `var(${timelineTableWidthCssPropertyName})`, paddingLeft: row.level * 20 }}>
			{
				showDragHandle && <DragHandle asChild>
					<Button variant="ghost"
							size="icon-xs"
							className="self-center opacity-10 group-hover/timelineRow:opacity-100"
							onClick={onChevronClick}>
						<GripVerticalIcon />
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
		</div>
	);
}
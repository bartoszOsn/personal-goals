import { Key, ReactNode } from 'react';
import { timelineTableWidthCssPropertyName } from '@/base/timeline/internal/timelineTableWidthCssPropertyName.ts';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '@/primitive/components/ui/button';
import { TimelineRowData } from '@/base/timeline/internal/TimelineRowData';
import { cn } from '@/primitive/lib/utils';

export function TimelineRowCell<TId extends Key, TData>(
	{ children, row, onChevronClick }:
	{ children?: ReactNode, row: TimelineRowData<TId, TData>, onChevronClick: () => void }
) {
	return (
		<div className="sticky left-0 border-r bg-background z-10 flex flex-row flex-nowrap overflow-hidden"
			 style={{ width: `var(${timelineTableWidthCssPropertyName})`, paddingLeft: row.level * 20 }}>
			<Button variant="ghost"
					size="icon"
					className={cn('self-center', row.children.length === 0 && 'invisible')}
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
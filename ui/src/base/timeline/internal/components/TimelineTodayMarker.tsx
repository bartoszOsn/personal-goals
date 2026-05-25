import { Temporal } from 'temporal-polyfill';
import { useIsMobile } from '@/primitive/hooks/use-mobile.ts';
import { timelineScaleToPxPerDay } from '@/base/timeline/internal/timelineScaleToPx.ts';
import { plainDateToPxOffset } from '@/base/timeline/internal/plainDateToPxOffset.ts';
import { isPlainDate } from '@personal-okr/shared';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/primitive/components/ui/tooltip';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/primitive/components/ui/item';

export function TimelineTodayMarker({ startDate, endDate, scale }: { startDate: Temporal.PlainDate; endDate: Temporal.PlainDate; scale: keyof typeof timelineScaleToPxPerDay }) {
	const today = Temporal.Now.plainDateTimeISO().toPlainDate();
	const isMobile = useIsMobile();

	const offset = plainDateToPxOffset(today, scale, startDate) + timelineScaleToPxPerDay[scale] / 2;

	if (isPlainDate(today).before(startDate) || isPlainDate(today).after(endDate) || isMobile) {
		return null;
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<div className='z-1 absolute -top-px -bottom-px w-2 flex items-center justify-center' style={{ left: `calc(${offset}px - 4px)`}}>
					<div className='h-full w-px bg-accent-foreground' />
				</div>
			</TooltipTrigger>
			<TooltipContent>
				<Item>
					<ItemContent>
						<ItemTitle>Today</ItemTitle>
						<ItemDescription>{today.toLocaleString()}</ItemDescription>
					</ItemContent>
				</Item>
			</TooltipContent>
		</Tooltip>

	)
}
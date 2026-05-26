import { timelineScaleToPxPerDay } from '@/base/timeline/internal/timelineScaleToPx';
import { Temporal } from 'temporal-polyfill';
import { isPlainDate } from '@personal-okr/shared';
import { TimelineTimebox } from '@/base/timeline/api/TimelineProps';
import { plainDateToPxOffset } from '@/base/timeline/internal/plainDateToPxOffset';
import { durationToPx } from '@/base/timeline/internal/durationToPx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/primitive/components/ui/tooltip';
import { formatTimeRange } from '@/base/formatTimeRange';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/primitive/components/ui/item';

export function TimelineHeaderChart({
	scale,
	startDate,
	endDate,
	timeboxes
}: {
	scale: keyof typeof timelineScaleToPxPerDay;
	startDate: Temporal.PlainDate,
	endDate: Temporal.PlainDate,
	timeboxes?: TimelineTimebox[]
}) {
	return (
		<div className='w-full flex flex-col flex-nowrap relative'>
			{ rowToZooms.year.includes(scale) && <HeaderRow headerCells={getYearHeaderCells(startDate, endDate)} startDate={startDate} scale={scale} />}
			{ rowToZooms.month.includes(scale) && <HeaderRow headerCells={getMonthHeaderCells(startDate, endDate)} startDate={startDate} scale={scale} />}
			{ rowToZooms.day.includes(scale) && <HeaderRow headerCells={getDayHeaderCells(startDate, endDate)} startDate={startDate} scale={scale} />}
			{ timeboxes && <HeaderRow headerCells={getTimeboxCells(timeboxes)} startDate={startDate} scale={scale} />}
		</div>
	)
}

const rowToZooms = {
	year: ['xs', 'sm', 'md', 'lg', 'xl'] as (keyof typeof timelineScaleToPxPerDay)[],
	month: ['xs', 'sm', 'md', 'lg', 'xl'] as (keyof typeof timelineScaleToPxPerDay)[],
	day: ['lg', 'xl'] as (keyof typeof timelineScaleToPxPerDay)[]
} as const satisfies Record<string, (keyof typeof timelineScaleToPxPerDay)[]>;

function HeaderRow({ headerCells, startDate, scale }: { headerCells: HeaderCell[], startDate: Temporal.PlainDate, scale: keyof typeof timelineScaleToPxPerDay }) {
	return (
		<div className='w-full h-5 relative text-xs'>
			{
				headerCells.map(cell => (
					<Tooltip key={formatTimeRange(cell.start, cell.end)}>
						<TooltipTrigger asChild>
							<div className='border rounded absolute top-0 bg-background text-center' style={{ left: plainDateToPxOffset(cell.start, scale, startDate), width: durationToPx(cell.start.until(cell.end), scale) }}>
								<p className='sticky left-0 pointer-events-none text-nowrap text-ellipsis overflow-hidden'>{cell.label}</p>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							{
								cell.showDatesOnHover
									? (
										<Item size='xs'>
											<ItemContent>
												<ItemTitle>{cell.label}</ItemTitle>
												<ItemDescription>{formatTimeRange(cell.start, cell.end)}</ItemDescription>
											</ItemContent>
										</Item>
									)
									: cell.label
							}
						</TooltipContent>
					</Tooltip>
				))
			}
		</div>
	);
}

interface HeaderCell {
	label: string;
	start: Temporal.PlainDate;
	end: Temporal.PlainDate;
	showDatesOnHover?: boolean;
}

function getTimeboxCells(timeboxes: TimelineTimebox[]): HeaderCell[] {
	return [...timeboxes].sort((a, b) => Temporal.PlainDate.compare(a.startDate, b.startDate))
		.map(timebox => ({
			label: timebox.name,
			start: timebox.startDate,
			end: timebox.endDate,
			showDatesOnHover: true
		}));
}

function getYearHeaderCells(startDate: Temporal.PlainDate, endDate: Temporal.PlainDate): HeaderCell[] {
	const result: HeaderCell[] = [];

	while (result.length === 0 || isPlainDate(result[result.length - 1].end).notEquals(endDate)) {
		const start = result.length === 0 ? startDate : result[result.length - 1].end;
		const end = startOfYear(start.year + 1);
		const label = start.year.toString();
		result.push({
			label,
			start,
			end: isPlainDate(end).after(endDate) ? endDate : end
		});
	}

	return result;
}

function getMonthHeaderCells(startDate: Temporal.PlainDate, endDate: Temporal.PlainDate): HeaderCell[] {
	const result: HeaderCell[] = [];
	while (result.length === 0 || isPlainDate(result[result.length - 1].end).notEquals(endDate)) {
		const start = result.length === 0 ? startDate : result[result.length - 1].end;
		const end = startOfMonth(start.year, start.month + 1);
		const label = start.toLocaleString('default', { month: 'short' });
		result.push({
			label,
			start,
			end: isPlainDate(end).after(endDate) ? endDate : end
		});
	}
	return result;
}

function getDayHeaderCells(startDate: Temporal.PlainDate, endDate: Temporal.PlainDate): HeaderCell[] {
	const result: HeaderCell[] = [];
	while (result.length === 0 || isPlainDate(result[result.length - 1].end).notEquals(endDate)) {
		const start = result.length === 0 ? startDate : result[result.length - 1].end;
		const end = start.add({ days: 1 });
		const label = start.toLocaleString('default', { day: '2-digit' });
		result.push({
			label,
			start,
			end: isPlainDate(end).after(endDate) ? endDate : end
		});
	}
	return result;
}

function startOfYear(year: number): Temporal.PlainDate {
	return Temporal.PlainDate.from({ year, month: 1, day: 1 });
}

function startOfMonth(year: number, month: number) {
	while (month > 12) {
		year++;
		month -= 12;
	}
	return Temporal.PlainDate.from({ year, month, day: 1 });
}
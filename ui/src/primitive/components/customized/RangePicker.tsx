import { ComponentProps, KeyboardEvent, ReactNode, useCallback, useState } from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { Temporal } from 'temporal-polyfill';
import { cn } from '@/primitive/lib/utils';
import { Button } from '@/primitive/components/ui/button';
import { ChevronsLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsRightIcon } from 'lucide-react';

export type DateRange = { start: Temporal.PlainDate; end: Temporal.PlainDate };

type DayCellState = {
	date: Temporal.PlainDate;
	isToday: boolean;
	isStart: boolean;
	isEnd: boolean;
	isInRange: boolean;
	isPendingStart: boolean;
	isHoverPreviewStart: boolean;
	isHoverPreview: boolean;
	isHoverPreviewEnd: boolean;
	isOutsideMonth: boolean;
};

function buildMonthGrid(year: number, month: number): (Temporal.PlainDate | null)[][] {
	const firstDay = Temporal.PlainDate.from({ year, month, day: 1 });
	const leadingEmpties = firstDay.dayOfWeek - 1;
	const flat: (Temporal.PlainDate | null)[] = [
		...Array(leadingEmpties).fill(null),
		...Array.from({ length: firstDay.daysInMonth }, (_, i) =>
			Temporal.PlainDate.from({ year, month, day: i + 1 })
		),
	];
	while (flat.length < 42) flat.push(null);
	return Array.from({ length: 6 }, (_, r) => flat.slice(r * 7, r * 7 + 7));
}

function getSecondMonth(year: number, month: number): { year: number; month: number } {
	if (month === 12) return { year: year + 1, month: 1 };
	return { year, month: month + 1 };
}

function getMonthLabel(year: number, month: number): string {
	return Temporal.PlainDate.from({ year, month, day: 1 }).toLocaleString('default', {
		month: 'long',
		year: 'numeric',
		calendar: 'iso8601',
	});
}

function computeDayCellState(
	date: Temporal.PlainDate,
	opts: {
		today: Temporal.PlainDate;
		viewMonth: number;
		viewYear: number;
		value: DateRange | null | undefined;
		pendingStart: Temporal.PlainDate | null;
		hoverDate: Temporal.PlainDate | null;
	}
): DayCellState {
	const { today, viewMonth, viewYear, value, pendingStart, hoverDate } = opts;
	const cmp = Temporal.PlainDate.compare;

	const isToday = cmp(date, today) === 0;
	const isOutsideMonth = date.month !== viewMonth || date.year !== viewYear;
	const isStart = !pendingStart && value != null && cmp(date, value.start) === 0;
	const isEnd = !pendingStart && value != null && cmp(date, value.end) === 0;
	const isInRange = !pendingStart && value != null && cmp(date, value.start) > 0 && cmp(date, value.end) < 0;
	const isPendingStart = pendingStart != null && cmp(date, pendingStart) === 0;

	const previewActive =
		pendingStart != null && hoverDate != null && cmp(hoverDate, pendingStart) >= 0;

	const isHoverPreview =
		previewActive && cmp(date, pendingStart!) >= 0 && cmp(date, hoverDate!) <= 0;
	const isHoverPreviewStart = previewActive && cmp(date, pendingStart!) === 0;
	const isHoverPreviewEnd = previewActive && cmp(date, hoverDate!) === 0;

	return {
		date,
		isToday,
		isOutsideMonth,
		isStart,
		isEnd,
		isInRange,
		isPendingStart,
		isHoverPreview,
		isHoverPreviewStart,
		isHoverPreviewEnd,
	};
}

function DayCell({
	state,
	onClick,
	onMouseEnter,
	onMouseLeave,
	onKeyDown,
}: {
	state: DayCellState;
	onClick: () => void;
	onMouseEnter: () => void;
	onMouseLeave: () => void;
	onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
}) {
	const { isStart, isEnd, isInRange, isPendingStart, isHoverPreview, isHoverPreviewStart, isHoverPreviewEnd, isToday, isOutsideMonth, date } = state;

	const hasStripe = isInRange || isHoverPreview || isStart || isEnd || isHoverPreviewStart || isHoverPreviewEnd;
	const isCirclePrimary = isStart || isEnd;
	const isCirclePending = (isPendingStart && !isStart && !isEnd) || (isHoverPreviewEnd && !isEnd) || (isHoverPreviewStart && !isStart);

	return (
		<div
			role="gridcell"
			className={cn(
				'relative flex flex-1 items-center justify-center',
				hasStripe && 'bg-accent',
				(isStart || isHoverPreviewStart) && 'rounded-l-full',
				(isEnd || isHoverPreviewEnd) && 'rounded-r-full',
				isStart && isEnd && 'rounded-full',
				isOutsideMonth && 'opacity-40',
			)}
		>
			<button
				type="button"
				data-date={date.toString()}
				aria-label={date.toLocaleString('default', { dateStyle: 'long', calendar: 'iso8601' })}
				aria-selected={isStart || isEnd || isInRange || undefined}
				aria-pressed={isPendingStart || undefined}
				onClick={onClick}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				onKeyDown={onKeyDown}
				className={cn(
					'relative z-10 flex size-8 items-center justify-center rounded-full text-sm transition-colors select-none',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
					'hover:bg-accent',
					isToday && 'text-primary font-medium',
					isCirclePrimary && 'bg-primary text-primary-foreground hover:bg-primary',
					isCirclePending && 'bg-primary/70 text-primary-foreground hover:bg-primary/70',
				)}
			>
				{date.day}
			</button>
		</div>
	);
}

const WEEKDAY_LABELS = [
	{ short: 'Mo', long: 'Monday' },
	{ short: 'Tu', long: 'Tuesday' },
	{ short: 'We', long: 'Wednesday' },
	{ short: 'Th', long: 'Thursday' },
	{ short: 'Fr', long: 'Friday' },
	{ short: 'Sa', long: 'Saturday' },
	{ short: 'Su', long: 'Sunday' },
];

function MonthGrid({
	year,
	month,
	today,
	value,
	pendingStart,
	hoverDate,
	onDayClick,
	onDayMouseEnter,
	onDayMouseLeave,
	onNavigate,
}: {
	year: number;
	month: number;
	today: Temporal.PlainDate;
	value: DateRange | null | undefined;
	pendingStart: Temporal.PlainDate | null;
	hoverDate: Temporal.PlainDate | null;
	onDayClick: (date: Temporal.PlainDate) => void;
	onDayMouseEnter: (date: Temporal.PlainDate) => void;
	onDayMouseLeave: () => void;
	onNavigate: (year: number, month: number) => void;
}) {
	const grid = buildMonthGrid(year, month);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLButtonElement>, date: Temporal.PlainDate) => {
			const moves: Record<string, () => Temporal.PlainDate> = {
				ArrowRight: () => date.add({ days: 1 }),
				ArrowLeft: () => date.subtract({ days: 1 }),
				ArrowDown: () => date.add({ weeks: 1 }),
				ArrowUp: () => date.subtract({ weeks: 1 }),
			};
			if (moves[e.key]) {
				e.preventDefault();
				const next = moves[e.key]();
				const btn = document.querySelector<HTMLButtonElement>(
					`button[data-date="${next.toString()}"]`
				);
				if (btn) {
					btn.focus();
				} else {
					const d = Temporal.PlainDate.from({ year: next.year, month: next.month, day: 1 });
					onNavigate(d.year, d.month);
					requestAnimationFrame(() => {
						document.querySelector<HTMLButtonElement>(
							`button[data-date="${next.toString()}"]`
						)?.focus();
					});
				}
			}
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				onDayClick(date);
			}
		},
		[onDayClick, onNavigate]
	);

	return (
		<div data-slot="range-picker-month" role="grid" aria-label={getMonthLabel(year, month)} className="flex flex-col gap-1">
			<div role="row" className="flex">
				{WEEKDAY_LABELS.map(({ short, long }) => (
					<div
						key={short}
						role="columnheader"
						aria-label={long}
						className="flex flex-1 items-center justify-center py-1 text-[0.8rem] font-normal text-muted-foreground select-none"
					>
						{short}
					</div>
				))}
			</div>
			{grid.map((row, rowIndex) => (
				<div key={rowIndex} role="row" className="flex">
					{row.map((cell, colIndex) =>
						cell === null ? (
							<div key={colIndex} role="gridcell" className="flex-1" />
						) : (
							<DayCell
								key={cell.toString()}
								state={computeDayCellState(cell, {
									today,
									viewMonth: month,
									viewYear: year,
									value,
									pendingStart,
									hoverDate,
								})}
								onClick={() => onDayClick(cell)}
								onMouseEnter={() => onDayMouseEnter(cell)}
								onMouseLeave={onDayMouseLeave}
								onKeyDown={(e) => handleKeyDown(e, cell)}
							/>
						)
					)}
				</div>
			))}
		</div>
	);
}

function RangePickerCalendar({
	value,
	pendingStart,
	hoverDate,
	viewYear,
	viewMonth,
	today,
	onDayClick,
	onDayMouseEnter,
	onDayMouseLeave,
	onNavigate,
}: {
	value: DateRange | null | undefined;
	pendingStart: Temporal.PlainDate | null;
	hoverDate: Temporal.PlainDate | null;
	viewYear: number;
	viewMonth: number;
	today: Temporal.PlainDate;
	onDayClick: (date: Temporal.PlainDate) => void;
	onDayMouseEnter: (date: Temporal.PlainDate) => void;
	onDayMouseLeave: () => void;
	onNavigate: (year: number, month: number) => void;
}) {
	const secondMonth = getSecondMonth(viewYear, viewMonth);

	const navigate = (delta: { months?: number; years?: number }) => {
		const d = Temporal.PlainDate.from({ year: viewYear, month: viewMonth, day: 1 }).add(delta);
		onNavigate(d.year, d.month);
	};

	return (
		<div data-slot="range-picker-calendar" className="flex flex-col gap-3 p-3">
			<div className="flex items-center gap-1">
				<Button variant="ghost" size="icon-sm" onClick={() => navigate({ years: -1 })} aria-label="Previous year">
					<ChevronsLeftIcon className="size-4" />
				</Button>
				<Button variant="ghost" size="icon-sm" onClick={() => navigate({ months: -1 })} aria-label="Previous month">
					<ChevronLeftIcon className="size-4" />
				</Button>
				<div className="flex flex-1 items-center justify-around text-sm font-medium select-none">
					<span>{getMonthLabel(viewYear, viewMonth)}</span>
					<span className="text-muted-foreground">|</span>
					<span>{getMonthLabel(secondMonth.year, secondMonth.month)}</span>
				</div>
				<Button variant="ghost" size="icon-sm" onClick={() => navigate({ months: 1 })} aria-label="Next month">
					<ChevronRightIcon className="size-4" />
				</Button>
				<Button variant="ghost" size="icon-sm" onClick={() => navigate({ years: 1 })} aria-label="Next year">
					<ChevronsRightIcon className="size-4" />
				</Button>
			</div>
			<div className="flex gap-4">
				<MonthGrid
					year={viewYear}
					month={viewMonth}
					today={today}
					value={value}
					pendingStart={pendingStart}
					hoverDate={hoverDate}
					onDayClick={onDayClick}
					onDayMouseEnter={onDayMouseEnter}
					onDayMouseLeave={onDayMouseLeave}
					onNavigate={onNavigate}
				/>
				<div className="w-px self-stretch bg-border" />
				<MonthGrid
					year={secondMonth.year}
					month={secondMonth.month}
					today={today}
					value={value}
					pendingStart={pendingStart}
					hoverDate={hoverDate}
					onDayClick={onDayClick}
					onDayMouseEnter={onDayMouseEnter}
					onDayMouseLeave={onDayMouseLeave}
					onNavigate={onNavigate}
				/>
			</div>
		</div>
	);
}

export function RangePickerTrigger({
	asChild,
	...props
}: ComponentProps<typeof PopoverPrimitive.Trigger> & { asChild?: boolean }) {
	return (
		<PopoverPrimitive.Trigger
			data-slot="range-picker-trigger"
			asChild={asChild}
			{...props}
		/>
	);
}

export function RangePicker({
	value,
	onValueChange,
	open: controlledOpen,
	onOpenChange,
	children,
}: {
	value?: DateRange | null;
	onValueChange?: (value: DateRange) => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	children: ReactNode;
}) {
	const [internalOpen, setInternalOpen] = useState(false);
	const isControlled = controlledOpen !== undefined;
	const resolvedOpen = isControlled ? controlledOpen : internalOpen;

	const [today] = useState<Temporal.PlainDate>(() => Temporal.Now.plainDateISO());
	const [viewYear, setViewYear] = useState(() => value?.start.year ?? today.year);
	const [viewMonth, setViewMonth] = useState(() => value?.start.month ?? today.month);
	const [pendingStart, setPendingStart] = useState<Temporal.PlainDate | null>(null);
	const [hoverDate, setHoverDate] = useState<Temporal.PlainDate | null>(null);

	const handleOpenChange = useCallback(
		(nextOpen: boolean) => {
			if (!nextOpen) {
				setPendingStart(null);
				setHoverDate(null);
			}
			if (!isControlled) setInternalOpen(nextOpen);
			onOpenChange?.(nextOpen);
		},
		[isControlled, onOpenChange]
	);

	const handleDayClick = useCallback(
		(date: Temporal.PlainDate) => {
			if (pendingStart === null) {
				setPendingStart(date);
			} else {
				if (Temporal.PlainDate.compare(date, pendingStart) >= 0) {
					onValueChange?.({ start: pendingStart, end: date });
					setPendingStart(null);
					setHoverDate(null);
					if (!isControlled) setInternalOpen(false);
					onOpenChange?.(false);
				} else {
					setPendingStart(date);
					setHoverDate(null);
				}
			}
		},
		[pendingStart, onValueChange, isControlled, onOpenChange]
	);

	const handleDayMouseEnter = useCallback(
		(date: Temporal.PlainDate) => {
			if (pendingStart !== null) setHoverDate(date);
		},
		[pendingStart]
	);

	const handleDayMouseLeave = useCallback(() => {
		setHoverDate(null);
	}, []);

	const handleNavigate = useCallback((year: number, month: number) => {
		setViewYear(year);
		setViewMonth(month);
	}, []);

	return (
		<PopoverPrimitive.Root
			data-slot="range-picker"
			open={resolvedOpen}
			onOpenChange={handleOpenChange}
		>
			{children}
			<PopoverPrimitive.Portal>
				<PopoverPrimitive.Content
					data-slot="range-picker-content"
					align="start"
					sideOffset={4}
					className={cn(
						'z-50 origin-(--radix-popover-content-transform-origin) rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden',
						'duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
						'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
						'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
						'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
					)}
				>
					<RangePickerCalendar
						value={value}
						pendingStart={pendingStart}
						hoverDate={hoverDate}
						viewYear={viewYear}
						viewMonth={viewMonth}
						today={today}
						onDayClick={handleDayClick}
						onDayMouseEnter={handleDayMouseEnter}
						onDayMouseLeave={handleDayMouseLeave}
						onNavigate={handleNavigate}
					/>
				</PopoverPrimitive.Content>
			</PopoverPrimitive.Portal>
		</PopoverPrimitive.Root>
	);
}


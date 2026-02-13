import { useGanttContext } from '@/base/gantt/GanttProvider.tsx';
import type { HeaderType } from '@/base/gantt/model/ZoomLevel.ts';
import { useDateRanges } from '@/base/gantt/hooks/useDateRanges.ts';
import { HtmlInSvg } from '@/base/gantt/chart/HtmlInSvg';
import { Text } from '@mantine/core';
import { Temporal } from 'temporal-polyfill';
import { isPlainDate } from '@personal-okr/shared';
import { useEffect } from 'react';

export const headerCellHeight = 30;
export const headerCellXMargin = 1;
export const headerRowYMargin = 4;

export function GanttChartHeader() {
	const context = useGanttContext();
	const { startDate, endDate, dateToPixelPos } = useDateRanges();
	const headerCells = getHeaderCells(context.zoomLevel.header, startDate, endDate);
	const subheaderCells = getHeaderCells(context.zoomLevel.subheader, startDate, endDate);
	const headerHeight = headerCellHeight * 2 + headerRowYMargin * 2;

	useEffect(() => {
		context.setChartHeaderSize(headerHeight);
	}, [context, headerHeight]);

	return (
		<g>
			<rect x={0} y={context.scrollY} width={dateToPixelPos(endDate)} height={headerHeight} fill="var(--mantine-color-body)" />
			<HeaderRow cells={headerCells} offsetY={0} />
			<HeaderRow cells={subheaderCells} offsetY={headerCellHeight + headerRowYMargin} />
		</g>
	);
}

function HeaderRow(props: { cells: HeaderCell[], offsetY: number }) {
	const context = useGanttContext();
	const { dateToPixelPos } = useDateRanges();

	return props.cells.map(cell => {
		const x = dateToPixelPos(cell.start) + headerCellXMargin;
		const y = context.scrollY + props.offsetY;
		const width = dateToPixelPos(cell.end) - dateToPixelPos(cell.start) - 2 * headerCellXMargin;
		const height = headerCellHeight;

		return (
			<g>
				<rect x={x}
					  y={y}
					  width={width}
					  height={height}
					  fill='transparent'
					  stroke="var(--mantine-color-gray-light)"
					  rx='4' />
				<HtmlInSvg x={x}
						   y={y}
						   width={width}
						   height={height}>
					<Text h="100%"
						  size="xs"
						  c="dimmed"
						  ta="center"
						  style={{ alignContent: 'center' }}>{cell.label}</Text>
				</HtmlInSvg>
			</g>
		);
	})
}

interface HeaderCell {
	label: string;
	start: Temporal.PlainDate;
	end: Temporal.PlainDate;
}

function getHeaderCells(zoomLevel: HeaderType, startDate: Temporal.PlainDate, endDate: Temporal.PlainDate): HeaderCell[] {
	switch (zoomLevel) {
		case 'year':
			return getYearHeaderCells(startDate, endDate);
		case 'month':
			return getMonthHeaderCells(startDate, endDate);
		case 'day':
			return getDayHeaderCells(startDate, endDate);
	}
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
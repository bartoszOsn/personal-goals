import { useGanttContext } from '@/base/gantt/GanttProvider.tsx';
import type { HeaderType } from '@/base/gantt/model/ZoomLevel.ts';
import { useDateRanges } from '@/base/gantt/hooks/useDateRanges.ts';
import { HtmlInSvg } from '@/base/gantt/chart/HtmlInSvg';
import { Text } from '@mantine/core';

export const headerCellHeight = 15;
export const headerCellXMargin = 1;
export const headerRowYMargin = 1;

export function GanttChartHeader() {
	const context = useGanttContext();
	const { startDate, endDate, dateToPixelPos } = useDateRanges();
	const headerCells = getHeaderCells(context.zoomLevel.header, startDate, endDate);
	const subheaderCells = getHeaderCells(context.zoomLevel.subheader, startDate, endDate);

	return (
		<g>
			<rect x={0} y={context.scrollY} width={dateToPixelPos(endDate)} height={headerCellHeight * 2 + headerRowYMargin * 2} fill="var(--mantine-color-body)" />
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
					  fill="var(--mantine-color-gray-0)"
					  rx='4' />
				<HtmlInSvg x={x}
						   y={y}
						   width={width}
						   height={height}>
					<Text h="100%"
						  size="xs"
						  c="dimmed"
						  ta="center"
						  style={{ alignContent: 'center', transform: 'scale(0.5)' }}>{cell.label}</Text>
				</HtmlInSvg>
			</g>
		);
	})
}

interface HeaderCell {
	label: string;
	start: Date;
	end: Date;
}

function getHeaderCells(zoomLevel: HeaderType, startDate: Date, endDate: Date): HeaderCell[] {
	switch (zoomLevel) {
		case 'year':
			return getYearHeaderCells(startDate, endDate);
		case 'month':
			return getMonthHeaderCells(startDate, endDate);
		case 'day':
			return getDayHeaderCells(startDate, endDate);
	}
}

function getYearHeaderCells(startDate: Date, endDate: Date): HeaderCell[] {
	const result: HeaderCell[] = [];

	while (result.length === 0 || result[result.length - 1].end !== endDate) {
		const start = result.length === 0 ? startDate : result[result.length - 1].end;
		const end = startOfYear(start.getFullYear() + 1);
		const label = start.getFullYear().toString();
		result.push({
			label,
			start,
			end: end > endDate ? endDate : end
		});
	}

	return result;
}

function getMonthHeaderCells(startDate: Date, endDate: Date): HeaderCell[] {
	const result: HeaderCell[] = [];
	while (result.length === 0 || result[result.length - 1].end !== endDate) {
		const start = result.length === 0 ? startDate : result[result.length - 1].end;
		const end = startOfMonth(start.getFullYear(), start.getMonth() + 1);
		const label = start.toLocaleString('default', { month: 'short' });
		result.push({
			label,
			start,
			end: end > endDate ? endDate : end
		});
	}
	return result;
}

function getDayHeaderCells(startDate: Date, endDate: Date): HeaderCell[] {
	const result: HeaderCell[] = [];
	while (result.length === 0 || result[result.length - 1].end !== endDate) {
		const start = result.length === 0 ? startDate : result[result.length - 1].end;
		const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1);
		const label = start.toLocaleString('default', { day: '2-digit' });
		result.push({
			label,
			start,
			end: end > endDate ? endDate : end
		});
	}
	return result;
}

function startOfYear(year: number): Date {
	return new Date(year, 0, 1);
}

function startOfMonth(year: number, month: number) {
	return new Date(year, month, 1);
}
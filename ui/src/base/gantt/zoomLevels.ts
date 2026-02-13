import type { ZoomLevel } from '@/base/gantt/model/ZoomLevel.ts';

export const zoomLevels: ZoomLevel[] = [
	{
		pixelsPerDay: 1,
		header: 'year',
		subheader: 'month',
		showWeekends: false,
	},
	{
		pixelsPerDay: 5,
		header: 'year',
		subheader: 'month',
		showWeekends: true
	},
	{
		pixelsPerDay: 20,
		header: 'month',
		subheader: 'day',
		showWeekends: true
	},
	{
		pixelsPerDay: 50,
		header: 'month',
		subheader: 'day',
		showWeekends: true
	}
];
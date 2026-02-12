import type { ZoomLevel } from '@/base/gantt/model/ZoomLevel.ts';

export const zoomLevels: ZoomLevel[] = [
	{
		pixelsPerDay: 1,
		header: 'year',
		subheader: 'month'
	},
	{
		pixelsPerDay: 5,
		header: 'year',
		subheader: 'month'
	},
	{
		pixelsPerDay: 20,
		header: 'month',
		subheader: 'day'
	},
	{
		pixelsPerDay: 50,
		header: 'month',
		subheader: 'day'
	}
];
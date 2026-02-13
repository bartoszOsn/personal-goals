export interface ZoomLevel {
	pixelsPerDay: number;
	header: HeaderType;
	subheader: HeaderType;
	showWeekends: boolean;
}

export type HeaderType = 'year' | 'month' | 'day';
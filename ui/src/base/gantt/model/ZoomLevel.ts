export interface ZoomLevel {
	pixelsPerDay: number;
	header: HeaderType;
	subheader: HeaderType;
}

export type HeaderType = 'year' | 'month' | 'day';
export const timelineScaleToPxPerDay = {
	xs: 2,
	sm: 4,
	md: 8,
	lg: 20,
	xl: 36,
} as const;

export const timelineScales: (keyof typeof timelineScaleToPxPerDay)[] = Object.entries(timelineScaleToPxPerDay).sort((a, b) => a[1] - b[1]).map((a) => a[0]) as (keyof typeof timelineScaleToPxPerDay)[];
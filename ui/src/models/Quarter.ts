export enum Quarter {
	Q1 = 'Q1',
	Q2 = 'Q2',
	Q3 = 'Q3',
	Q4 = 'Q4'
}

export const quarterToNumber: Record<Quarter, 1 | 2 | 3 | 4> = {
	[Quarter.Q1]: 1,
	[Quarter.Q2]: 2,
	[Quarter.Q3]: 3,
	[Quarter.Q4]: 4
} as const;

export const numberToQuarter: Record<1 | 2 | 3 | 4, Quarter> = {
	[1]: Quarter.Q1,
	[2]: Quarter.Q2,
	[3]: Quarter.Q3,
	[4]: Quarter.Q4
} as const;
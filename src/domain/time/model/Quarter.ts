import { Year } from './Year';

export class Quarter {
	constructor(
		public readonly index: QuarterIndex,
		public readonly year: Year
	) {}
}

export enum QuarterIndex {
	Q1 = 'Q1',
	Q2 = 'Q2',
	Q3 = 'Q3',
	Q4 = 'Q4'
}

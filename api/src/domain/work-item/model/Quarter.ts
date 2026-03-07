import { UnreachableError } from '../../../util/UnreachableError';

export enum Quarter {
	Q1 = 'Q1',
	Q2 = 'Q2',
	Q3 = 'Q3',
	Q4 = 'Q4'
}

export function quarterToNumber(quarter: Quarter): 1 | 2 | 3 | 4 {
	switch (quarter) {
		case Quarter.Q1:
			return 1;
		case Quarter.Q2:
			return 2;
		case Quarter.Q3:
			return 3;
		case Quarter.Q4:
			return 4;
		default:
			throw new UnreachableError(quarter);
	}
}

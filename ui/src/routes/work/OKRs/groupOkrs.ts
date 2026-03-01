import { Objective } from '@/models/Objective';

export interface OKRYear {
	year: number;
	global: Objective[];
	Q1: Objective[];
	Q2: Objective[];
	Q3: Objective[];
	Q4: Objective[];
}

export function groupOkrs(okrs: Objective[]): OKRYear[] {
	 const map = new Map<number, OKRYear>();

	for (const okr of okrs) {
		if (!map.has(okr.deadline.year)) {
			map.set(okr.deadline.year, {
				year: okr.deadline.year,
				global: [],
				Q1: [],
				Q2: [],
				Q3: [],
				Q4: [],
			});
		}

		const year = map.get(okr.deadline.year)!;
		if (!okr.deadline.quarter) {
			year.global.push(okr);
		} else {
			year[okr.deadline.quarter].push(okr);
		}
	}

	return [...map.values()].sort((a, b) => a.year - b.year);
}
import type { ObjectiveDTO } from '@personal-okr/shared';

export interface OKRYear {
	year: number;
	global: ObjectiveDTO[];
	Q1: ObjectiveDTO[];
	Q2: ObjectiveDTO[];
	Q3: ObjectiveDTO[];
	Q4: ObjectiveDTO[];
}

export function groupOkrs(okrs: ObjectiveDTO[]): OKRYear[] {
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
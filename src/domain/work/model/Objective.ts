import { RichText } from './RichText';
import { Year } from '../../time/model/Year';
import { Quarter } from '../../time/model/Quarter';

export class Objective {
	constructor(
		public readonly id: ObjectiveId,
		public readonly name: string,
		public readonly description: RichText,
		public readonly deadline: ObjectiveDeadline
	) {}
}

export class ObjectiveId {
	constructor(public readonly id: string) {}
}

export class ObjectiveDeadline {
	private constructor(
		public readonly year: Year,
		public readonly quarter?: Quarter
	) {}

	static yearly(year: Year): ObjectiveDeadline {
		return new ObjectiveDeadline(year);
	}

	static quarterly(year: Year, quarter: Quarter): ObjectiveDeadline {
		return new ObjectiveDeadline(year, quarter);
	}
}

import { ContextYear } from './ContextYear';
import { Temporal } from 'temporal-polyfill';
import { Quarter } from './Quarter';
import { Sprint } from '../../time/model/Sprint';
import { TimeFrameOutOfContextException } from '../error/TimeFrameOutOfContextException';

export abstract class WorkItemTimeFrame {
	protected constructor(public readonly context: ContextYear) {}

	public abstract getStart(): Temporal.PlainDate;
	public abstract getEnd(): Temporal.PlainDate;

	protected isFullyInContext(): boolean {
		const start = this.getStart();
		const end = this.getEnd();

		return (
			start.year === this.context.year && end.year === this.context.year
		);
	}
}

export class WholeYearWorkItemTimeFrame extends WorkItemTimeFrame {
	constructor(context: ContextYear) {
		super(context);
		if (!this.isFullyInContext()) {
			throw new TimeFrameOutOfContextException(
				'WorkItemTimeFrame must be fully in context'
			);
		}
	}

	override getStart(): Temporal.PlainDate {
		return Temporal.PlainDate.from(`${this.context.year}-01-01`);
	}

	override getEnd(): Temporal.PlainDate {
		return Temporal.PlainDate.from(`${this.context.year}-12-31`);
	}
}

export class QuarterWorkItemTimeFrame extends WorkItemTimeFrame {
	private static quarterToNumber: Record<Quarter, number> = {
		[Quarter.Q1]: 1,
		[Quarter.Q2]: 2,
		[Quarter.Q3]: 3,
		[Quarter.Q4]: 4
	};

	constructor(
		context: ContextYear,
		public readonly quarter: Quarter
	) {
		super(context);
		if (!this.isFullyInContext()) {
			throw new TimeFrameOutOfContextException(
				'WorkItemTimeFrame must be fully in context'
			);
		}
	}

	override getStart(): Temporal.PlainDate {
		const quarterNum =
			QuarterWorkItemTimeFrame.quarterToNumber[this.quarter];
		return Temporal.PlainDate.from(`${this.context.year}-01-01`).add({
			months: (quarterNum - 1) * 3
		});
	}

	override getEnd(): Temporal.PlainDate {
		return this.getStart().add({ months: 3 });
	}
}

export class CustomDateWorkItemTimeFrame extends WorkItemTimeFrame {
	constructor(
		context: ContextYear,
		private readonly start: Temporal.PlainDate,
		private readonly end: Temporal.PlainDate
	) {
		super(context);
		if (!this.isFullyInContext()) {
			throw new TimeFrameOutOfContextException(
				'WorkItemTimeFrame must be fully in context'
			);
		}
	}

	override getStart(): Temporal.PlainDate {
		return this.start;
	}

	override getEnd(): Temporal.PlainDate {
		return this.end;
	}
}

export class SprintWorkItemTimeFrame extends WorkItemTimeFrame {
	constructor(
		context: ContextYear,
		public readonly sprint: Sprint
	) {
		super(context);
		if (!this.isFullyInContext()) {
			throw new TimeFrameOutOfContextException(
				'WorkItemTimeFrame must be fully in context'
			);
		}
	}

	override getStart(): Temporal.PlainDate {
		return this.sprint.startDate;
	}

	override getEnd(): Temporal.PlainDate {
		return this.sprint.endDate;
	}
}

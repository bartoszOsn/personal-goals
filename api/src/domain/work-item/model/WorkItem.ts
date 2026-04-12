import { WorkItemType } from './WorkItemType';
import { WorkItemId } from './WorkItemId';
import { ContextYear } from '../../common/model/ContextYear';
import { WorkItemTitle } from './WorkItemTitle';
import { WorkItemDescription } from './WorkItemDescription';
import { WorkItemStatus } from './WorkItemStatus';
import { Percentage, WorkItemProgress } from './WorkItemProgress';
import { WorkItemTimeFrame } from './WorkItemTimeFrame';
import { TimeFrameOutOfContextException } from '../error/TimeFrameOutOfContextException';
import { LexicalRank } from '../../common/model/LexicalRank';

export abstract class WorkItem {
	private _timeFrame: WorkItemTimeFrame | null = null;

	protected _parent: WorkItem | null = null;
	protected _children: WorkItem[] = [];

	protected constructor(
		public readonly type: WorkItemType,
		public readonly id: WorkItemId,
		public readonly contextYear: ContextYear,
		public title: WorkItemTitle,
		public description: WorkItemDescription,
		public status: WorkItemStatus,
		timeFrame: WorkItemTimeFrame | null,
		public hierarchyOrder: LexicalRank | null,
		public sprintOverviewOrder: LexicalRank | null
	) {
		this.timeFrame = timeFrame;
	}

	abstract get progress(): WorkItemProgress;

	get timeFrame(): WorkItemTimeFrame | null {
		return this._timeFrame;
	}

	set timeFrame(timeFrame: WorkItemTimeFrame | null) {
		if (timeFrame && !timeFrame.context.equals(this.contextYear)) {
			throw new TimeFrameOutOfContextException(
				'Time frame is out of bounds'
			);
		}

		this._timeFrame = timeFrame;
	}

	get parent(): WorkItem | null {
		return this._parent;
	}

	set parent(parent: WorkItem | null) {
		if (parent === this._parent) {
			return;
		}

		if (this._parent !== null) {
			this._parent.removeChild(this);
		}

		this._parent = parent;

		if (parent !== null) {
			parent.addChild(this);
		}
	}

	get children(): WorkItem[] {
		return this._children;
	}

	protected addChild(child: WorkItem) {
		if (this._children.includes(child)) {
			return;
		}

		this._children.push(child);
		child.parent = this;
	}

	protected removeChild(child: WorkItem) {
		this._children = this._children.filter((c) => !c.id.equals(child.id));
	}

	protected getChildrenProgressAverage(): WorkItemProgress {
		if (this._children.length === 0) {
			return WorkItemProgress.empty();
		}

		let completedSum = 0;
		let failedSum = 0;

		for (const child of this._children) {
			completedSum += child.progress.completed.value;
			failedSum += child.progress.failed.value;
		}

		return new WorkItemProgress(
			Percentage.fraction(completedSum, this._children.length),
			Percentage.fraction(failedSum, this._children.length)
		);
	}
}

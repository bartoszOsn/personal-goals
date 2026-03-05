import { WorkItemType } from './WorkItemType';
import { WorkItemId } from './WorkItemId';
import { WorkItemTimeFrame } from './WorkItemTimeFrame';
import { ContextYear } from './ContextYear';
import { WorkItemStatus } from './WorkItemStatus';
import { WorkItemProgress } from './WorkItemProgress';

export abstract class WorkItem {
	protected _parent: WorkItem | null = null;
	protected _children: WorkItem[] = [];

	constructor(
		public readonly type: WorkItemType,
		public readonly id: WorkItemId,
		public readonly contextYear: ContextYear,
		public readonly title: string,
		public readonly description: string,
		public readonly timeFrame: WorkItemTimeFrame,
		public readonly status: WorkItemStatus,
		public readonly progress: WorkItemProgress
	) {}

	public get parent(): WorkItem | null {
		return this._parent;
	}

	public get children(): ReadonlyArray<WorkItem> {
		return this._children;
	}

	protected setParent(parent: WorkItem) {
		if (this._parent) {
			parent._children = parent._children.filter(
				(child: WorkItem) => child !== this
			);
		}

		this._parent = parent;
		parent._children.push(this);
	}
}

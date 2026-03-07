import { WorkItemType } from './WorkItemType';
import { WorkItemId } from './WorkItemId';
import { WorkItemTimeFrame } from './WorkItemTimeFrame';
import { ContextYear } from './ContextYear';
import { WorkItemStatus } from './WorkItemStatus';
import {
	IObjectWithProgressAndStatus,
	WorkItemProgress
} from './WorkItemProgress';
import { WorkItemTitle } from './WorkItemTitle';
import { WorkItemDescription } from './WorkItemDescription';

export abstract class WorkItem implements IObjectWithProgressAndStatus {
	protected _parent: WorkItem | null = null;
	protected _children: WorkItem[] = [];

	constructor(
		public readonly type: WorkItemType,
		public readonly id: WorkItemId,
		public readonly contextYear: ContextYear,
		public readonly title: WorkItemTitle,
		public readonly description: WorkItemDescription,
		public readonly timeFrame: WorkItemTimeFrame | null,
		public readonly status: WorkItemStatus,
		public readonly progress: WorkItemProgress
	) {
		progress.setTarget(this);
	}

	public get parent(): WorkItem | null {
		return this._parent;
	}

	public get children(): ReadonlyArray<WorkItem> {
		return this._children;
	}

	public find(id: WorkItemId): WorkItem | null {
		if (id.equals(this.id)) {
			return this;
		}

		for (const child of this._children) {
			const found = child.find(id);
			if (found) {
				return found;
			}
		}

		return null;
	}

	protected setParent(parent: WorkItem | null): void {
		if (this._parent) {
			this._parent._children = this._parent._children.filter(
				(child: WorkItem) => child !== this
			);
		}

		this._parent = parent;
		parent?._children.push(this);
	}
}

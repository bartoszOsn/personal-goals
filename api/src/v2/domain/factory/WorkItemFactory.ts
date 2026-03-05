import { WorkItem } from '../model/WorkItem';
import { WorkItemHierarchyValidator } from './WorkItemHierarchyValidator';

export type WorkItemCreationParams = ConstructorParameters<typeof WorkItem>;

class WorkItemImpl extends WorkItem {
	public setParent(parent: WorkItem) {
		super.setParent(parent);
	}
}

export class WorkItemFactory {
	private constructor(
		private readonly root: WorkItemImpl,
		private readonly current: WorkItemImpl
	) {}

	static ofRoot(...params: WorkItemCreationParams): WorkItemFactory {
		const root = new WorkItemImpl(...params);

		return new WorkItemFactory(root, root);
	}

	public addChild(...params: WorkItemCreationParams): WorkItemFactory {
		const child = new WorkItemImpl(...params);

		child.setParent(this.current);
		return new WorkItemFactory(this.root, child);
	}

	public buildRoot(): WorkItem {
		WorkItemHierarchyValidator.validateRoot(this.root);

		return this.root;
	}
}

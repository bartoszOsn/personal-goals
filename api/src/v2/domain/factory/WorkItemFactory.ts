import { WorkItem } from '../model/WorkItem';
import { WorkItemHierarchyValidator } from './WorkItemHierarchyValidator';
import { ContextYear } from '../model/ContextYear';
import { WorkItemType } from '../model/WorkItemType';
import { WorkItemCreationParams } from './WorkItemCreationParams';
import { WorkItemDefaultCreationParamsResolver } from './WorkItemDefaultCreationParamsResolver';
import { WorkItemId } from '../model/WorkItemId';

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

	static ofDefaultRoot(
		context: ContextYear,
		type: WorkItemType
	): WorkItemFactory {
		return this.ofRoot(
			...WorkItemDefaultCreationParamsResolver.getDefaultCreationParamsForType(
				context,
				type
			)
		);
	}

	static ofExistingRoot(root: WorkItem): WorkItemFactory {
		return new WorkItemFactory(root as WorkItemImpl, root as WorkItemImpl);
	}

	public addChild(...params: WorkItemCreationParams): WorkItemFactory {
		const child = new WorkItemImpl(...params);

		child.setParent(this.current);
		return new WorkItemFactory(this.root, child);
	}

	public addChildWithDefaults(type: WorkItemType): WorkItemFactory {
		return this.addChild(
			...WorkItemDefaultCreationParamsResolver.getDefaultCreationParamsForType(
				this.current.contextYear,
				type
			)
		);
	}

	public find(id: WorkItemId): WorkItemFactory {
		const current = this.root.find(id);

		if (!current) {
			throw new Error(`WorkItem with ID ${id} not found`);
		}

		return new WorkItemFactory(this.root, current as WorkItemImpl);
	}

	public buildRoot(): WorkItem {
		WorkItemHierarchyValidator.validateRoot(this.root);

		return this.root;
	}

	public buildCurrent(): WorkItem {
		WorkItemHierarchyValidator.validateRoot(this.root);

		return this.current;
	}

	public build(): [root: WorkItem, current: WorkItem] {
		WorkItemHierarchyValidator.validateRoot(this.root);

		return [this.root, this.current];
	}
}

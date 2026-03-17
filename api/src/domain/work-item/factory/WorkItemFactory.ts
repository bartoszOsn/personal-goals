import { WorkItem } from '../model/WorkItem';
import { WorkItemHierarchyValidator } from './WorkItemHierarchyValidator';
import { ContextYear } from '../../common/model/ContextYear';
import { WorkItemType } from '../model/WorkItemType';
import { WorkItemCreationParams } from './WorkItemCreationParams';
import { WorkItemDefaultCreationParamsResolver } from './WorkItemDefaultCreationParamsResolver';
import { WorkItemId } from '../model/WorkItemId';
import { WorkItemUpdateRequest } from '../model/WorkItemUpdateRequest';
import { WorkItemNotFoundError } from '../error/WorkItemNotFoundError';

class WorkItemImpl extends WorkItem {
	public override setParent(parent: WorkItem | null) {
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

	public update(updateRequest: WorkItemUpdateRequest): WorkItemFactory {
		if (!this.current.id.equals(updateRequest.id)) {
			throw new Error('Cannot update id of WorkItem');
		}

		const params: WorkItemCreationParams = [
			updateRequest.type === undefined
				? this.current.type
				: updateRequest.type,
			this.current.id,
			updateRequest.contextYear === undefined
				? this.current.contextYear
				: updateRequest.contextYear,
			updateRequest.title === undefined
				? this.current.title
				: updateRequest.title,
			updateRequest.description === undefined
				? this.current.description
				: updateRequest.description,
			updateRequest.timeFrame === undefined
				? this.current.timeFrame
				: updateRequest.timeFrame,
			updateRequest.status === undefined
				? this.current.status
				: updateRequest.status,
			updateRequest.progress === undefined
				? this.current.progress
				: updateRequest.progress
		];

		const newWorkItem = new WorkItemImpl(...params);
		for (const child of this.current.children) {
			if (updateRequest.contextYear !== undefined) {
				const contextUpdateRequest = new WorkItemUpdateRequest(
					child.id,
					updateRequest.contextYear
				);
				this.find(child.id).update(contextUpdateRequest);
			}
			(child as WorkItemImpl).setParent(newWorkItem);
		}

		if (this.current.parent !== null) {
			newWorkItem.setParent(this.current.parent);
			this.current.setParent(null);
		}

		return new WorkItemFactory(
			this.root.id.equals(newWorkItem.id) ? newWorkItem : this.root,
			newWorkItem
		);
	}

	public delete(): WorkItemFactory {
		if (this.root.id.equals(this.current.id)) {
			throw new Error('Cannot delete root work item from the tree');
		}

		this.current.setParent(null);
		return new WorkItemFactory(this.root, this.root);
	}

	public find(id: WorkItemId): WorkItemFactory {
		const current = this.root.find(id);

		if (!current) {
			throw new WorkItemNotFoundError(
				`WorkItem with ID ${id.id} not found`
			);
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

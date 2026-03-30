import { ContextYear } from '../../common/model/ContextYear';
import { WorkItem } from '../model/WorkItem';
import { WorkItemType } from '../model/WorkItemType';
import { Goal } from '../model/Goal';
import { Task } from '../model/Task';
import { Group } from '../model/Group';
import { UnreachableError } from '../../../util/UnreachableError';
import { WorkItemId } from '../model/WorkItemId';
import { WorkItemNotFoundError } from '../error/WorkItemNotFoundError';
import { LexicalRank } from '../../common/model/LexicalRank';
import { WorkItemsUpdateRequest } from '../model/WorkItemsUpdateRequest';
import {
	WorkItemHierarchyMoveRequest,
	WorkItemHierarchyMoveRequestOrder
} from '../model/WorkItemHierarchyMoveRequest';

export class WorkHierarchyForContextAggregate {
	constructor(
		public context: ContextYear,
		public roots: WorkItem[]
	) {
		if (roots.some((root) => root.parent !== null)) {
			throw new Error('Root work items cannot have parents');
		}
	}

	create(type: WorkItemType, parent?: WorkItem): void {
		const item = this.instantiateDefaultWorkItem(type);

		if (parent) {
			item.parent = parent;
			parent.children.sort((a, b) =>
				LexicalRank.compare(a.hierarchyOrder, b.hierarchyOrder)
			);
		} else {
			this.roots.push(item);
			this.roots.sort((a, b) =>
				LexicalRank.compare(a.hierarchyOrder, b.hierarchyOrder)
			);
		}
	}

	update(request: WorkItemsUpdateRequest): void {
		for (let update of request.updates) {
			const workItem = this.findById(update.id);

			if (update.title !== undefined) {
				workItem.title = update.title;
			}

			if (update.description !== undefined) {
				workItem.description = update.description;
			}

			if (update.timeFrame !== undefined) {
				workItem.timeFrame = update.timeFrame;
			}

			if (update.status !== undefined) {
				workItem.status = update.status;
			}
		}
	}

	move(request: WorkItemHierarchyMoveRequest): void {
		const item = this.findById(request.id);
		if (request.parentId === null) {
			const allRanks = this.roots.map((root) => root.hierarchyOrder);
			const newRank = this.getNewRank(request.order, allRanks);
			item.hierarchyOrder = newRank;
			item.parent = null;
			this.roots.sort((a, b) =>
				LexicalRank.compare(a.hierarchyOrder, b.hierarchyOrder)
			);
		} else {
			const parent = this.findById(request.parentId);
			const allRanks = parent.children.map(
				(child) => child.hierarchyOrder
			);
			const newRank = this.getNewRank(request.order, allRanks);
			item.hierarchyOrder = newRank;
			item.parent = parent;
			parent.children.sort((a, b) =>
				LexicalRank.compare(a.hierarchyOrder, b.hierarchyOrder)
			);
		}
	}

	delete(itemIds: WorkItemId[]) {
		let toDelete = [...itemIds];
		const queue = [...this.roots];

		while (queue.length > 0) {
			const item = queue.shift();
			if (toDelete.some((id) => id.equals(item.id))) {
				if (item.parent) {
					item.parent = null;
				} else {
					this.roots = this.roots.filter((root) => root !== item);
				}
			} else {
				queue.push(...item.children);
			}
		}

		if (toDelete.length > 0) {
			throw new WorkItemNotFoundError(
				`Can't delete ${toDelete.length} items, as they couldn't be found.`
			);
		}
	}

	private instantiateDefaultWorkItem(type: WorkItemType): WorkItem {
		switch (type) {
			case WorkItemType.GOAL:
				return Goal.default(this.context);
			case WorkItemType.TASK:
				return Task.default(this.context);
			case WorkItemType.GROUP:
				return Group.default(this.context);
			default:
				throw new UnreachableError(type);
		}
	}

	private findById(id: WorkItemId): WorkItem {
		const queue = [...this.roots];
		while (queue.length > 0) {
			const item = queue.shift();
			if (item.id.equals(id)) {
				return item;
			}

			queue.push(...item.children);
		}

		throw new WorkItemNotFoundError(`Can't find work item with id ${id}`);
	}

	private getNewRank(
		order: WorkItemHierarchyMoveRequestOrder,
		allRanks: LexicalRank[]
	) {
		if (order.isFirst()) {
			return LexicalRank.beforeAll(allRanks);
		} else if (order.isLast()) {
			return LexicalRank.afterAll(allRanks);
		} else if (order.isBetween()) {
			return LexicalRank.between(
				this.findById(order.after).hierarchyOrder,
				this.findById(order.before).hierarchyOrder
			);
		}
	}
}

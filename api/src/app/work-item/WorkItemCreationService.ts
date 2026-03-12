import { Injectable } from '@nestjs/common';
import { WorkItemRepository } from './WorkItemRepository';
import { ContextYear } from '../../domain/common/model/ContextYear';
import { WorkItemType } from '../../domain/work-item/model/WorkItemType';
import { WorkItemId } from '../../domain/work-item/model/WorkItemId';
import { WorkItem } from '../../domain/work-item/model/WorkItem';
import { WorkItemFactory } from '../../domain/work-item/factory/WorkItemFactory';
import { UserStorage } from '../auth/UserStorage';
import { WorkItemNotFoundError } from '../../domain/work-item/error/WorkItemNotFoundError';

@Injectable()
export class WorkItemCreationService {
	constructor(
		private readonly workItemRepository: WorkItemRepository,
		private readonly userStorage: UserStorage
	) {}

	async createWorkItem(
		context: ContextYear,
		type: WorkItemType,
		parentId?: WorkItemId
	): Promise<WorkItem> {
		if (!parentId) {
			return this.createRootWorkItem(context, type);
		}

		return this.createChildWorkItem(type, parentId);
	}

	private async createRootWorkItem(
		context: ContextYear,
		type: WorkItemType
	): Promise<WorkItem> {
		const user = await this.userStorage.getUser();

		const root = WorkItemFactory.ofDefaultRoot(context, type).buildRoot();
		await this.workItemRepository.save(root, user);
		return root;
	}

	private async createChildWorkItem(
		type: WorkItemType,
		parentId: WorkItemId
	): Promise<WorkItem> {
		const user = await this.userStorage.getUser();

		const root = await this.workItemRepository.findRootByIncluded(
			parentId,
			user
		);

		if (!root) {
			throw new WorkItemNotFoundError(`Work item not found`);
		}

		const [updatedRoot, newWorkItem] = WorkItemFactory.ofExistingRoot(root)
			.find(parentId)
			.addChildWithDefaults(type)
			.build();

		await this.workItemRepository.save(updatedRoot, user);
		return newWorkItem;
	}
}

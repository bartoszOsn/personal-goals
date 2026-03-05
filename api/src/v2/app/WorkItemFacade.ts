import { Injectable } from '@nestjs/common';
import { WorkItemRepository } from './WorkItemRepository';
import { WorkItemCreationService } from './WorkItemCreationService';
import { WorkItemUpdateService } from './WorkItemUpdateService';
import { WorkItemDeletionService } from './WorkItemDeletionService';
import { ContextYear } from '../domain/model/ContextYear';
import { WorkItem } from '../domain/model/WorkItem';
import { UserStorage } from '../../app/auth/UserStorage';
import { WorkItemId } from '../domain/model/WorkItemId';
import { WorkItemNotFoundError } from '../domain/error/WorkItemNotFoundError';
import { WorkItemType } from '../domain/model/WorkItemType';
import { WorkItemUpdateRequest } from '../domain/model/WorkItemUpdateRequest';

@Injectable()
export class WorkItemFacade {
	constructor(
		private readonly workItemRepository: WorkItemRepository,
		private readonly workItemCreationService: WorkItemCreationService,
		private readonly workItemUpdateService: WorkItemUpdateService,
		private readonly workItemDeletionService: WorkItemDeletionService,
		private readonly userStorage: UserStorage
	) {}

	async getWorkItemsByContext(contextYear: ContextYear): Promise<WorkItem[]> {
		const user = await this.userStorage.getUser();
		return this.workItemRepository.findByContextYear(contextYear, user);
	}

	async getWorkItemById(id: WorkItemId): Promise<WorkItem> {
		const user = await this.userStorage.getUser();
		const root = await this.workItemRepository.findRootByIncluded(id, user);
		const workItem = root?.find(id);

		if (!workItem) {
			throw new WorkItemNotFoundError('Work item not found');
		}

		return workItem;
	}

	createWorkItem(
		context: ContextYear,
		type: WorkItemType,
		parentId?: WorkItemId
	): Promise<WorkItem> {
		return this.workItemCreationService.createWorkItem(
			context,
			type,
			parentId
		);
	}

	updateWorkItem(updateRequest: WorkItemUpdateRequest): Promise<WorkItem> {
		return this.workItemUpdateService.updateWorkItem(updateRequest);
	}

	deleteWorkItems(ids: WorkItemId[]): Promise<void> {
		return this.workItemDeletionService.deleteWorkItems(ids);
	}
}

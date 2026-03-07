import { Injectable } from '@nestjs/common';
import { WorkItem } from '../../domain/work-item/model/WorkItem';
import { WorkItemUpdateRequest } from '../../domain/work-item/model/WorkItemUpdateRequest';
import { WorkItemRepository } from './WorkItemRepository';
import { UserStorage } from '../auth/UserStorage';
import { WorkItemFactory } from '../../domain/work-item/factory/WorkItemFactory';
import { WorkItemNotFoundError } from '../../domain/work-item/error/WorkItemNotFoundError';

@Injectable()
export class WorkItemUpdateService {
	constructor(
		private readonly workItemRepository: WorkItemRepository,
		private readonly userStorage: UserStorage
	) {}

	async updateWorkItem(
		updateRequest: WorkItemUpdateRequest
	): Promise<WorkItem> {
		const user = await this.userStorage.getUser();

		const root = await this.workItemRepository.findRootByIncluded(
			updateRequest.id,
			user
		);

		if (!root) {
			throw new WorkItemNotFoundError(`Work item not found`);
		}

		const [updatedRoot, updatedCurrent] = WorkItemFactory.ofExistingRoot(
			root
		)
			.find(updateRequest.id)
			.update(updateRequest)
			.build();

		await this.workItemRepository.save(updatedRoot, user);
		return updatedCurrent;
	}
}

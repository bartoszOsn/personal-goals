import { Injectable } from '@nestjs/common';
import { WorkItem } from '../domain/model/WorkItem';
import { WorkItemUpdateRequest } from '../domain/model/WorkItemUpdateRequest';
import { WorkItemRepository } from './WorkItemRepository';
import { UserStorage } from '../../app/auth/UserStorage';
import { WorkItemFactory } from '../domain/factory/WorkItemFactory';

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

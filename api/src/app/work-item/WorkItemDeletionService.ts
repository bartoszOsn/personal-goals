import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkItemRepository } from './WorkItemRepository';
import { UserStorage } from '../auth/UserStorage';
import { WorkItemId } from '../../domain/work-item/model/WorkItemId';
import { WorkItemFactory } from '../../domain/work-item/factory/WorkItemFactory';

@Injectable()
export class WorkItemDeletionService {
	constructor(
		private readonly workItemRepository: WorkItemRepository,
		private readonly userStorage: UserStorage
	) {}

	async deleteWorkItems(ids: WorkItemId[]): Promise<void> {
		const user = await this.userStorage.getUser();
		let anyDeleted = false;

		for (const id of ids) {
			const root = await this.workItemRepository.findRootByIncluded(
				id,
				user
			);

			if (!root) {
				continue;
			}

			if (root.id.equals(id)) {
				await this.workItemRepository.deleteRoot(root, user);
			} else {
				const updatedRoot = WorkItemFactory.ofExistingRoot(root)
					.find(id)
					.delete()
					.buildRoot();
				await this.workItemRepository.save(updatedRoot, user);
			}
			anyDeleted = true;
		}

		if (!anyDeleted) {
			throw new NotFoundException(`Work item not found`);
		}
	}
}

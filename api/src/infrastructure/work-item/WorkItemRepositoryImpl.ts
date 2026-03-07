import { Injectable } from '@nestjs/common';
import { WorkItemRepository } from '../../app/work-item/WorkItemRepository';
import { User } from '../../domain/auth/model/User';
import { ContextYear } from '../../domain/work-item/model/ContextYear';
import { WorkItem } from '../../domain/work-item/model/WorkItem';
import { WorkItemId } from '../../domain/work-item/model/WorkItemId';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkItemEntity } from './entity/WorkItemEntity';
import { Repository, TreeRepository } from 'typeorm';

@Injectable()
export class WorkItemRepositoryImpl extends WorkItemRepository {
	constructor(
		@InjectRepository(WorkItemEntity)
		private readonly workItemRepository: TreeRepository<WorkItemEntity>
	) {
		super();
	}

	async findByContextYear(
		context: ContextYear,
		user: User
	): Promise<WorkItem[]> {
		const entities = await this.workItemRepository.findBy({
			contextYear: context.year,
			user: { id: user.id.id }
		});
		return [];
	}
	findRootByIncluded(id: WorkItemId, user: User): Promise<WorkItem | null> {
		throw new Error('Method not implemented.');
	}
	save(root: WorkItem, user: User): Promise<void> {
		throw new Error('Method not implemented.');
	}
	deleteRoot(root: WorkItem, user: User): Promise<void> {
		throw new Error('Method not implemented.');
	}
}

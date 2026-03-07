import { Injectable } from '@nestjs/common';
import { WorkItemRepository } from '../../app/work-item/WorkItemRepository';
import { User } from '../../domain/auth/model/User';
import { ContextYear } from '../../domain/work-item/model/ContextYear';
import { WorkItem } from '../../domain/work-item/model/WorkItem';
import { WorkItemId } from '../../domain/work-item/model/WorkItemId';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkItemEntity } from './entity/WorkItemEntity';
import { In, TreeRepository } from 'typeorm';
import { WorkItemEntityConverter } from './WorkItemEntityConverter';

@Injectable()
export class WorkItemRepositoryImpl extends WorkItemRepository {
	constructor(
		@InjectRepository(WorkItemEntity)
		private readonly workItemRepository: TreeRepository<WorkItemEntity>,
		private readonly workItemEntityConverter: WorkItemEntityConverter
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
	}

	async findRootByIncluded(
		id: WorkItemId,
		user: User
	): Promise<WorkItem | null> {
		return null;
	}

	async save(root: WorkItem, user: User): Promise<void> {
		const old = await this.findRootByIncluded(root.id, user);
		const oldFlat = old?.toFlat();

		const newFlat = root.toFlat();
		const entitiesToSave = newFlat.map((workItem) =>
			this.workItemEntityConverter.flatWorkItemToEntity(workItem, user)
		);

		await this.workItemRepository.save(entitiesToSave);
		const idsToDelete =
			oldFlat
				?.filter((item) => newFlat.find((flat) => flat.id === item.id))
				.map((item) => item.id.id) ?? [];

		if (idsToDelete.length > 0) {
			await this.workItemRepository.delete({
				id: In(idsToDelete)
			});
		}
	}

	deleteRoot(root: WorkItem, user: User): Promise<void> {
		throw new Error('Method not implemented.');
	}
}

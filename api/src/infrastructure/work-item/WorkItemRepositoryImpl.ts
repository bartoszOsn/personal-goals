import { Injectable } from '@nestjs/common';
import { WorkItemRepository } from '../../app/work-item/WorkItemRepository';
import { User } from '../../domain/auth/model/User';
import { ContextYear } from '../../domain/common/model/ContextYear';
import { WorkItem } from '../../domain/work-item/model/WorkItem';
import { WorkItemId } from '../../domain/work-item/model/WorkItemId';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkItemEntityOld } from './entity/WorkItemEntityOld';
import { In, TreeRepository } from 'typeorm';
import { WorkItemEntityConverter } from './WorkItemEntityConverter';

@Injectable()
export class WorkItemRepositoryImpl extends WorkItemRepository {
	constructor(
		@InjectRepository(WorkItemEntityOld)
		private readonly workItemRepository: TreeRepository<WorkItemEntityOld>,
		private readonly workItemEntityConverter: WorkItemEntityConverter
	) {
		super();
	}

	async findByContextYear(
		context: ContextYear,
		user: User
	): Promise<WorkItem[]> {
		const roots = await this.workItemRepository
			.createQueryBuilder('workItem')
			.leftJoinAndSelect('workItem.parent', 'parent')
			.leftJoinAndSelect('workItem.timeFrame.sprint', 'sprint')
			.where('workItem.contextYear = :year', { year: context.year })
			.andWhere('workItem.user.id = :userId', { userId: user.id.id })
			.andWhere('workItem.parent IS NULL')
			.getMany();

		const rootsWithChildren = await Promise.all(
			roots.map(async (root) => {
				return await this.workItemRepository.findDescendantsTree(root, {
					relations: ['timeFrame.sprint']
				});
			})
		);

		return Promise.all(
			rootsWithChildren.map((entity) =>
				this.workItemEntityConverter.entityToWorkItem(entity)
			)
		);
	}

	async findRootByIncluded(
		id: WorkItemId,
		user: User
	): Promise<WorkItem | null> {
		const entity = await this.workItemRepository.findOne({
			where: {
				id: id.id,
				user: { id: user.id.id }
			},
			relations: {
				timeFrame: {
					sprint: true
				}
			}
		});

		if (!entity) {
			return null;
		}

		const ancestors = await this.workItemRepository.findAncestors(entity, {
			relations: ['timeFrame.sprint']
		});
		const root = ancestors.at(-1) ?? entity;

		const rootWithChildren =
			await this.workItemRepository.findDescendantsTree(root, {
				relations: ['timeFrame.sprint']
			});

		return await this.workItemEntityConverter.entityToWorkItem(
			rootWithChildren
		);
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
				?.filter(
					(item) => !newFlat.some((flat) => flat.id.equals(item.id))
				)
				.map((item) => item.id.id) ?? [];

		if (idsToDelete.length > 0) {
			await this.workItemRepository.delete({
				id: In(idsToDelete)
			});
		}
	}

	async deleteRoot(root: WorkItem, _user: User): Promise<void> {
		await this.workItemRepository.delete({
			id: root.id.id
		});
	}
}

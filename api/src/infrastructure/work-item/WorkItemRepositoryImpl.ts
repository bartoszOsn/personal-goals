import { Injectable } from '@nestjs/common';
import { WorkItemRepository } from '../../app/work-item/WorkItemRepository';
import { User } from '../../domain/auth/model/User';
import { ContextYear } from '../../domain/common/model/ContextYear';
import { Sprint } from '../../domain/sprint/model/Sprint';
import { TaskSprintOverviewAggregate } from '../../domain/work-item/aggregate/TaskSprintOverviewAggregate';
import { WorkHierarchyForContextAggregate } from '../../domain/work-item/aggregate/WorkHierarchyForContextAggregate';
import { WorkItemDetailsAggregate } from '../../domain/work-item/aggregate/WorkItemDetailsAggregate';
import { WorkItemId } from '../../domain/work-item/model/WorkItemId';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkItemEntity } from './entity/WorkItemEntity';
import { In, TreeRepository } from 'typeorm';
import { WorkItemEntityConverter } from './WorkItemEntityConverter';
import { WorkItem } from '../../domain/work-item/model/WorkItem';
import { WorkItemType } from '../../domain/work-item/model/WorkItemType';
import { Task } from '../../domain/work-item/model/Task';
import { WorkItemNotFoundError } from '../../domain/work-item/error/WorkItemNotFoundError';

@Injectable()
export class WorkItemRepositoryImpl extends WorkItemRepository {
	constructor(
		@InjectRepository(WorkItemEntity)
		private readonly workItemRepository: TreeRepository<WorkItemEntity>,
		private readonly workItemEntityConverter: WorkItemEntityConverter
	) {
		super();
	}

	async getHierarchyForContext(
		context: ContextYear,
		user: User
	): Promise<WorkHierarchyForContextAggregate> {
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

		return new WorkHierarchyForContextAggregate(
			context,
			await Promise.all(
				rootsWithChildren.map((entity) =>
					this.workItemEntityConverter.entityToWorkItem(entity)
				)
			)
		);
	}

	async saveHierarchy(
		hierarchy: WorkHierarchyForContextAggregate,
		user: User
	): Promise<void> {
		const oldHierarchy = await this.getHierarchyForContext(
			hierarchy.context,
			user
		);

		const flatWorkItems = this.flatWorkItems(hierarchy.roots);
		const oldFlatWorkItems = this.flatWorkItems(oldHierarchy.roots);

		const entitiesToSave = flatWorkItems.map((entity) =>
			this.workItemEntityConverter.flatWorkItemToEntity(entity, user)
		);

		const idsToDelete = oldFlatWorkItems
			.filter(
				(old) => !flatWorkItems.some((newWI) => old.id.equals(newWI.id))
			)
			.map((old) => old.id.id);

		await this.workItemRepository.delete({
			id: In(idsToDelete)
		});
		await this.workItemRepository.save(entitiesToSave);
	}

	async getSprintOverviewForSprint(
		sprint: Sprint,
		user: User
	): Promise<TaskSprintOverviewAggregate> {
		const hierarchy = await this.getHierarchyForContext(
			sprint.context,
			user
		);
		const workItems = this.flatWorkItems(hierarchy.roots).filter(
			(workItem): workItem is Task =>
				workItem.type === WorkItemType.TASK &&
				!!workItem.timeFrame &&
				sprint.overlapWithRange(
					workItem.timeFrame.getStart(),
					workItem.timeFrame.getEnd()
				)
		);

		return new TaskSprintOverviewAggregate(sprint, workItems);
	}

	async saveSprintOverview(
		sprintOverview: TaskSprintOverviewAggregate,
		user: User
	): Promise<void> {
		const entities = sprintOverview.tasks.map((task) =>
			this.workItemEntityConverter.flatWorkItemToEntity(task, user)
		);

		await this.workItemRepository.save(entities);
	}

	async getWorkItemDetails(
		workItemId: WorkItemId,
		user: User
	): Promise<WorkItemDetailsAggregate> {
		const entity = await this.workItemRepository.findOne({
			where: {
				id: workItemId.id,
				user: { id: user.id.id }
			},
			relations: {
				timeFrame: {
					sprint: true
				}
			}
		});

		if (!entity) {
			throw new WorkItemNotFoundError('Cannot find work item');
		}

		return new WorkItemDetailsAggregate(
			await this.workItemEntityConverter.entityToWorkItem(entity)
		);
	}

	private flatWorkItems(roots: WorkItem[]): WorkItem[] {
		const queue = [...roots];
		const result: WorkItem[] = [];
		while (queue.length > 0) {
			const item = queue.shift()!;
			result.push(item);
			queue.push(...item.children);
		}
		return result;
	}
}

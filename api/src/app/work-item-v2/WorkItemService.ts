import { Injectable } from '@nestjs/common';
import { WorkItemRepository } from './WorkItemRepository';
import { ContextYear } from '../../domain/common/model/ContextYear';
import { WorkHierarchyForContextAggregate } from '../../domain/work-item-v2/aggregate/WorkHierarchyForContextAggregate';
import { UserStorage } from '../auth/UserStorage';
import { WorkItemType } from '../../domain/work-item-v2/model/WorkItemType';
import { WorkItem } from '../../domain/work-item-v2/model/WorkItem';
import { WorkItemsUpdateRequest } from '../../domain/work-item-v2/model/WorkItemsUpdateRequest';
import { WorkItemHierarchyMoveRequest } from '../../domain/work-item-v2/model/WorkItemHierarchyMoveRequest';
import { WorkItemId } from '../../domain/work-item-v2/model/WorkItemId';
import { Sprint } from '../../domain/sprint/model/Sprint';
import { TaskSprintOverviewAggregate } from '../../domain/work-item-v2/aggregate/TaskSprintOverviewAggregate';
import { WorkItemStatus } from '../../domain/work-item-v2/model/WorkItemStatus';
import { SprintOverviewMoveRequest } from '../../domain/work-item-v2/model/SprintOverviewMoveRequest';
import { WorkItemDetailsAggregate } from '../../domain/work-item-v2/aggregate/WorkItemDetailsAggregate';

@Injectable()
export class WorkItemService {
	constructor(
		private readonly workItemRepository: WorkItemRepository,
		private readonly userStorage: UserStorage
	) {}

	async getHierarchyForContext(
		context: ContextYear
	): Promise<WorkHierarchyForContextAggregate> {
		const user = await this.userStorage.getUser();
		return this.workItemRepository.getHierarchyForContext(context, user);
	}

	async createInHierarchy(
		context: ContextYear,
		type: WorkItemType,
		parent?: WorkItemId
	): Promise<WorkHierarchyForContextAggregate> {
		const user = await this.userStorage.getUser();
		const aggregate = await this.workItemRepository.getHierarchyForContext(
			context,
			user
		);
		aggregate.create(type, parent);
		await this.workItemRepository.saveHierarchy(aggregate, user);
		return aggregate;
	}

	async updateInHierarchy(
		context: ContextYear,
		request: WorkItemsUpdateRequest
	): Promise<WorkHierarchyForContextAggregate> {
		const user = await this.userStorage.getUser();
		const aggregate = await this.workItemRepository.getHierarchyForContext(
			context,
			user
		);
		aggregate.update(request);
		await this.workItemRepository.saveHierarchy(aggregate, user);
		return aggregate;
	}

	async moveInHierarchy(
		context: ContextYear,
		request: WorkItemHierarchyMoveRequest
	): Promise<WorkHierarchyForContextAggregate> {
		const user = await this.userStorage.getUser();
		const aggregate = await this.workItemRepository.getHierarchyForContext(
			context,
			user
		);
		aggregate.move(request);
		await this.workItemRepository.saveHierarchy(aggregate, user);
		return aggregate;
	}

	async deleteInHierarchy(
		context: ContextYear,
		itemIds: WorkItemId[]
	): Promise<WorkHierarchyForContextAggregate> {
		const user = await this.userStorage.getUser();
		const aggregate = await this.workItemRepository.getHierarchyForContext(
			context,
			user
		);
		aggregate.delete(itemIds);
		await this.workItemRepository.saveHierarchy(aggregate, user);
		return aggregate;
	}

	async getSprintOverview(
		sprint: Sprint
	): Promise<TaskSprintOverviewAggregate> {
		const user = await this.userStorage.getUser();

		return await this.workItemRepository.getSprintOverviewForSprint(
			sprint,
			user
		);
	}

	async createInSprintOverview(
		sprint: Sprint,
		status: WorkItemStatus
	): Promise<TaskSprintOverviewAggregate> {
		const user = await this.userStorage.getUser();
		const aggregate =
			await this.workItemRepository.getSprintOverviewForSprint(
				sprint,
				user
			);
		aggregate.create(status);
		await this.workItemRepository.saveSprintOverview(aggregate, user);
		return aggregate;
	}

	async moveInSprintOverview(
		sprint: Sprint,
		request: SprintOverviewMoveRequest
	): Promise<TaskSprintOverviewAggregate> {
		const user = await this.userStorage.getUser();
		const aggregate =
			await this.workItemRepository.getSprintOverviewForSprint(
				sprint,
				user
			);
		aggregate.move(request);
		await this.workItemRepository.saveSprintOverview(aggregate, user);
		return aggregate;
	}

	async getWorkItemDetails(
		id: WorkItemId
	): Promise<WorkItemDetailsAggregate> {
		const user = await this.userStorage.getUser();
		return this.workItemRepository.getWorkItemDetails(id, user);
	}
}

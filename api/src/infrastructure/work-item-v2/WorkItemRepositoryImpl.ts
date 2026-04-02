import { Injectable } from '@nestjs/common';
import { WorkItemRepository } from '../../app/work-item-v2/WorkItemRepository';
import { User } from '../../domain/auth/model/User';
import { ContextYear } from '../../domain/common/model/ContextYear';
import { Sprint } from '../../domain/sprint/model/Sprint';
import { TaskSprintOverviewAggregate } from '../../domain/work-item-v2/aggregate/TaskSprintOverviewAggregate';
import { WorkHierarchyForContextAggregate } from '../../domain/work-item-v2/aggregate/WorkHierarchyForContextAggregate';
import { WorkItemDetailsAggregate } from '../../domain/work-item-v2/aggregate/WorkItemDetailsAggregate';
import { WorkItemId } from '../../domain/work-item-v2/model/WorkItemId';

@Injectable()
export class WorkItemRepositoryImpl extends WorkItemRepository {
	getHierarchyForContext(
		context: ContextYear,
		user: User
	): Promise<WorkHierarchyForContextAggregate> {
		throw new Error('Method not implemented.');
	}
	saveHierarchy(
		hierarchy: WorkHierarchyForContextAggregate,
		user: User
	): Promise<void> {
		throw new Error('Method not implemented.');
	}
	getSprintOverviewForSprint(
		sprint: Sprint,
		user: User
	): Promise<TaskSprintOverviewAggregate> {
		throw new Error('Method not implemented.');
	}
	saveSprintOverview(
		sprintOverview: TaskSprintOverviewAggregate,
		user: User
	): Promise<void> {
		throw new Error('Method not implemented.');
	}
	getWorkItemDetails(
		workItemId: WorkItemId,
		user: User
	): Promise<WorkItemDetailsAggregate> {
		throw new Error('Method not implemented.');
	}
}
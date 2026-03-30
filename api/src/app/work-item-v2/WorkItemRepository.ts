import { ContextYear } from '../../domain/common/model/ContextYear';
import { WorkHierarchyForContextAggregate } from '../../domain/work-item-v2/aggregate/WorkHierarchyForContextAggregate';
import { Sprint } from '../../domain/sprint/model/Sprint';
import { TaskSprintOverviewAggregate } from '../../domain/work-item-v2/aggregate/TaskSprintOverviewAggregate';
import { WorkItemId } from '../../domain/work-item-v2/model/WorkItemId';
import { WorkItemDetailsAggregate } from '../../domain/work-item-v2/aggregate/WorkItemDetailsAggregate';
import { User } from '../../domain/auth/model/User';

export abstract class WorkItemRepository {
	abstract getHierarchyForContext(
		context: ContextYear,
		user: User
	): Promise<WorkHierarchyForContextAggregate>;
	abstract saveHierarchy(
		hierarchy: WorkHierarchyForContextAggregate,
		user: User
	): Promise<void>;

	abstract getSprintOverviewForSprint(
		sprint: Sprint,
		user: User
	): Promise<TaskSprintOverviewAggregate>;
	abstract saveSprintOverview(
		sprintOverview: TaskSprintOverviewAggregate,
		user: User
	): Promise<void>;

	abstract getWorkItemDetails(
		workItemId: WorkItemId,
		user: User
	): Promise<WorkItemDetailsAggregate>;
}

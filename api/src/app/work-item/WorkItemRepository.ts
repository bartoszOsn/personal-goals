import { WorkItemId } from '../../domain/work-item/model/WorkItemId';
import { WorkItem } from '../../domain/work-item/model/WorkItem';
import { User } from '../../domain/auth/model/User';
import { ContextYear } from '../../domain/common/model/ContextYear';

export abstract class WorkItemRepository {
	abstract findByContextYear(
		context: ContextYear,
		user: User
	): Promise<WorkItem[]>;
	abstract findRootByIncluded(
		id: WorkItemId,
		user: User
	): Promise<WorkItem | null>;
	abstract save(root: WorkItem, user: User): Promise<void>;
	abstract deleteRoot(root: WorkItem, user: User): Promise<void>;
}

import { WorkItemId } from '../domain/model/WorkItemId';
import { WorkItem } from '../domain/model/WorkItem';
import { User } from '../../domain/auth/model/User';

export abstract class WorkItemRepository {
	abstract findRootByIncluded(id: WorkItemId, user: User): Promise<WorkItem>;
	abstract save(root: WorkItem, user: User): Promise<void>;
	abstract deleteRoot(root: WorkItem, user: User): Promise<void>;
}

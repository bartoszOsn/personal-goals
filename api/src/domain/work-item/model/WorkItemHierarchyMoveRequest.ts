import { WorkItemId } from './WorkItemId';
import { MoveRequestOrder } from './MoveRequestOrder';

export class WorkItemHierarchyMoveRequest {
	constructor(
		public readonly id: WorkItemId,
		public readonly parentId: WorkItemId | null,
		public readonly order: MoveRequestOrder
	) {}
}

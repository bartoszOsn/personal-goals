import { WorkItemId } from './WorkItemId';
import { MoveRequestOrder } from './MoveRequestOrder';
import { WorkItemStatus } from './WorkItemStatus';

export class SprintOverviewMoveRequest {
	constructor(
		public readonly id: WorkItemId,
		public readonly status: WorkItemStatus,
		public readonly order: MoveRequestOrder
	) {}
}

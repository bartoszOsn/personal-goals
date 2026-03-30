import { WorkItemId } from './WorkItemId';
import { MoveRequestOrder } from './MoveRequestOrder';

export class SprintOverviewMoveRequest {
	constructor(
		public readonly id: WorkItemId,
		public readonly order: MoveRequestOrder
	) {}
}

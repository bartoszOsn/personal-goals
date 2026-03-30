import { WorkItemId } from './WorkItemId';
import { WorkItemTitle } from './WorkItemTitle';
import { WorkItemDescription } from './WorkItemDescription';
import { WorkItemTimeFrame } from './WorkItemTimeFrame';
import { WorkItemStatus } from './WorkItemStatus';

export class WorkItemsUpdateRequest {
	constructor(public readonly updates: WorkItemUpdateRequest[]) {}
}

export class WorkItemUpdateRequest {
	constructor(
		public readonly id: WorkItemId,
		public readonly title?: WorkItemTitle,
		public readonly description?: WorkItemDescription,
		public readonly timeFrame?: WorkItemTimeFrame | null,
		public readonly status?: WorkItemStatus
	) {}
}

import { WorkItemId } from './WorkItemId';
import { WorkItemType } from './WorkItemType';
import { WorkItemTitle } from './WorkItemTitle';
import { WorkItemDescription } from './WorkItemDescription';
import { WorkItemTimeFrame } from './WorkItemTimeFrame';
import { WorkItemStatus } from './WorkItemStatus';
import { ManualWorkItemProgress } from './WorkItemProgress';
import { ContextYear } from './ContextYear';

export class WorkItemUpdateRequest {
	constructor(
		public readonly id: WorkItemId,
		public readonly contextYear?: ContextYear,
		public readonly type?: WorkItemType,
		public readonly title?: WorkItemTitle,
		public readonly description?: WorkItemDescription,
		public readonly timeFrame?: WorkItemTimeFrame | null,
		public readonly status?: WorkItemStatus,
		public readonly progress?: ManualWorkItemProgress
	) {}
}

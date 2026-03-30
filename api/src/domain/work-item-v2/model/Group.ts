import { WorkItem } from './WorkItem';
import { WorkItemId } from './WorkItemId';
import { ContextYear } from '../../common/model/ContextYear';
import { WorkItemTitle } from './WorkItemTitle';
import { WorkItemDescription } from './WorkItemDescription';
import { WorkItemStatus } from './WorkItemStatus';
import { WorkItemType } from './WorkItemType';
import { WorkItemProgress } from './WorkItemProgress';
import { WorkItemTimeFrame } from './WorkItemTimeFrame';
import { LexicalRank } from '../../common/model/LexicalRank';

export class Group extends WorkItem {
	constructor(
		id: WorkItemId,
		contextYear: ContextYear,
		title: WorkItemTitle,
		description: WorkItemDescription,
		status: WorkItemStatus,
		timeFrame: WorkItemTimeFrame | null,
		hierarchyOrder: LexicalRank | null,
		sprintOverviewOrder: LexicalRank | null
	) {
		super(
			WorkItemType.GROUP,
			id,
			contextYear,
			title,
			description,
			status,
			timeFrame,
			hierarchyOrder,
			sprintOverviewOrder
		);
	}

	static default(contextYear: ContextYear): Group {
		return new Group(
			WorkItemId.random(),
			contextYear,
			new WorkItemTitle('New group'),
			WorkItemDescription.empty(),
			WorkItemStatus.TO_DO,
			null,
			null,
			null
		);
	}

	get progress(): WorkItemProgress {
		return this.getChildrenProgressAverage();
	}
}

import { WorkItem } from './WorkItem';
import { WorkItemProgress } from './WorkItemProgress';
import { WorkItemType } from './WorkItemType';
import { WorkItemId } from './WorkItemId';
import { ContextYear } from '../../common/model/ContextYear';
import { WorkItemTitle } from './WorkItemTitle';
import { WorkItemDescription } from './WorkItemDescription';
import { WorkItemStatus } from './WorkItemStatus';
import { UnreachableError } from '../../../util/UnreachableError';
import { InvalidWorkItemHierarchyException } from '../error/InvalidWorkItemHierarchyException';
import { WorkItemTimeFrame } from './WorkItemTimeFrame';
import { LexicalRank } from '../../common/model/LexicalRank';

export class Task extends WorkItem {
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
			WorkItemType.TASK,
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

	static default(contextYear: ContextYear): Task {
		return new Task(
			WorkItemId.random(),
			contextYear,
			new WorkItemTitle('New task'),
			WorkItemDescription.empty(),
			WorkItemStatus.TO_DO,
			null,
			null,
			null
		);
	}

	get progress(): WorkItemProgress {
		switch (this.status) {
			case WorkItemStatus.TO_DO:
			case WorkItemStatus.IN_PROGRESS:
				return WorkItemProgress.empty();
			case WorkItemStatus.FAILED:
				return WorkItemProgress.fullyFailed();
			case WorkItemStatus.DONE:
				return WorkItemProgress.fullyCompleted();
			default:
				throw new UnreachableError(this.status);
		}
	}

	override addChild(): void {
		throw new InvalidWorkItemHierarchyException(
			'Task cannot have children.'
		);
	}
}

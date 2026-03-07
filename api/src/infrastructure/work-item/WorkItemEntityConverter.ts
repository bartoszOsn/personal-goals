import { Injectable } from '@nestjs/common';
import { WorkItem } from '../../domain/work-item/model/WorkItem';
import { WorkItemEntity } from './entity/WorkItemEntity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkItemType } from '../../domain/work-item/model/WorkItemType';
import { UnreachableError } from '../../util/UnreachableError';
import { User } from '../../domain/auth/model/User';
import { WorkItemStatus } from '../../domain/work-item/model/WorkItemStatus';
import {
	CustomDateWorkItemTimeFrame,
	QuarterWorkItemTimeFrame,
	SprintWorkItemTimeFrame,
	WholeYearWorkItemTimeFrame,
	WorkItemTimeFrame
} from '../../domain/work-item/model/WorkItemTimeFrame';
import { WorkItemTimeFrameEntity } from './entity/WorkItemTimeFrameEntity';
import {
	ChildrenProgressBasedWorkItemProgress,
	ChildrenStatusBasedWorkItemProgress,
	ManualWorkItemProgress,
	WorkItemProgress
} from '../../domain/work-item/model/WorkItemProgress';
import { WorkItemProgressEntity } from './entity/WorkItemProgressEntity';
import { quarterToNumber } from '../../domain/work-item/model/Quarter';
import { DeepPartial } from 'typeorm/common/DeepPartial';

@Injectable()
export class WorkItemEntityConverter {
	constructor(
		@InjectRepository(WorkItemEntity)
		private readonly workItemRepository: Repository<WorkItemEntity>
	) {}

	flatWorkItemToEntity(workItem: WorkItem, user: User): WorkItemEntity {
		return this.workItemRepository.create({
			id: workItem.id.id,
			type: this.workItemTypeToEntity(workItem.type),
			contextYear: workItem.contextYear.year,
			title: workItem.title.title,
			description: workItem.description.description,
			status: this.workItemStatusToEntity(workItem.status),
			timeFrame: this.workItemTimeFrameToEntity(workItem.timeFrame),
			progress: this.workItemProgressToEntity(workItem.progress),
			user: { id: user.id.id },
			parent: workItem.parent ? { id: workItem.parent.id.id } : undefined
		});
	}

	private workItemTypeToEntity(type: WorkItemType): WorkItemEntity['type'] {
		switch (type) {
			case WorkItemType.TASK:
				return 'task';
			case WorkItemType.KEY_RESULT:
				return 'keyResult';
			case WorkItemType.OBJECTIVE:
				return 'objective';
			default:
				throw new UnreachableError(type);
		}
	}

	private workItemStatusToEntity(
		status: WorkItemStatus
	): WorkItemEntity['status'] {
		switch (status) {
			case WorkItemStatus.TO_DO:
				return 'todo';
			case WorkItemStatus.IN_PROGRESS:
				return 'inProgress';
			case WorkItemStatus.DONE:
				return 'done';
			case WorkItemStatus.FAILED:
				return 'failed';
			default:
				throw new UnreachableError(status);
		}
	}

	private workItemTimeFrameToEntity(
		timeFrame: WorkItemTimeFrame | null
	): DeepPartial<WorkItemTimeFrameEntity> {
		if (timeFrame === null) {
			return { type: 'null' };
		}

		if (timeFrame instanceof WholeYearWorkItemTimeFrame) {
			return { type: 'wholeYear' };
		}

		if (timeFrame instanceof QuarterWorkItemTimeFrame) {
			return {
				type: 'quarter',
				quarter: quarterToNumber(timeFrame.quarter)
			};
		}

		if (timeFrame instanceof CustomDateWorkItemTimeFrame) {
			return {
				type: 'customDate',
				startDate: timeFrame.getStart().toString(),
				endDate: timeFrame.getEnd().toString()
			};
		}

		if (timeFrame instanceof SprintWorkItemTimeFrame) {
			return {
				type: 'sprint',
				sprint: { id: timeFrame.sprint.id.value }
			};
		}

		throw new Error('Unknown time frame type');
	}

	private workItemProgressToEntity(
		progress: WorkItemProgress
	): WorkItemProgressEntity {
		if (progress instanceof ManualWorkItemProgress) {
			return {
				type: 'manual',
				manualProgress: progress.getPercentage().value
			};
		}

		if (progress instanceof ChildrenProgressBasedWorkItemProgress) {
			return {
				type: 'childrenProgressBased'
			};
		}

		if (progress instanceof ChildrenStatusBasedWorkItemProgress) {
			return {
				type: 'ChildrenStatusBased'
			};
		}

		throw new Error('Unknown progress type');
	}
}

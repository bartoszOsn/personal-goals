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
	WorkItemProgress,
	Percentage
} from '../../domain/work-item/model/WorkItemProgress';
import { WorkItemProgressEntity } from './entity/WorkItemProgressEntity';
import { quarterToNumber, Quarter } from '../../domain/work-item/model/Quarter';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { WorkItemFactory } from '../../domain/work-item/factory/WorkItemFactory';
import { WorkItemId } from '../../domain/work-item/model/WorkItemId';
import { ContextYear } from '../../domain/work-item/model/ContextYear';
import { WorkItemTitle } from '../../domain/work-item/model/WorkItemTitle';
import { WorkItemDescription } from '../../domain/work-item/model/WorkItemDescription';
import { Temporal } from 'temporal-polyfill';
import { Sprint } from '../../domain/time/model/Sprint';
import { SprintId } from '../../domain/time/model/SprintId';
import { Year } from '../../domain/time/model/Year';
import { Quarter as TimeQuarter } from '../../domain/time/model/Quarter';
import { SprintStatus } from '../../domain/time/model/SprintStatus';

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

	entityToWorkItem(entity: WorkItemEntity): WorkItem {
		let factory = WorkItemFactory.ofRoot(
			this.entityToWorkItemType(entity.type),
			new WorkItemId(entity.id),
			new ContextYear(entity.contextYear),
			new WorkItemTitle(entity.title),
			new WorkItemDescription(entity.description),
			this.entityToWorkItemTimeFrame(
				entity.timeFrame,
				new ContextYear(entity.contextYear)
			),
			this.entityToWorkItemStatus(entity.status),
			this.entityToWorkItemProgress(entity.progress)
		);

		factory = this.addChildrenRecursively(factory, entity.children);

		return factory.buildRoot();
	}

	private addChildrenRecursively(
		factory: WorkItemFactory,
		children: WorkItemEntity[]
	): WorkItemFactory {
		if (!children || children.length === 0) {
			return factory;
		}

		for (const child of children) {
			const childFactory = factory.addChild(
				this.entityToWorkItemType(child.type),
				new WorkItemId(child.id),
				new ContextYear(child.contextYear),
				new WorkItemTitle(child.title),
				new WorkItemDescription(child.description),
				this.entityToWorkItemTimeFrame(
					child.timeFrame,
					new ContextYear(child.contextYear)
				),
				this.entityToWorkItemStatus(child.status),
				this.entityToWorkItemProgress(child.progress)
			);

			this.addChildrenRecursively(childFactory, child.children);
		}

		return factory;
	}

	private entityToWorkItemType(type: WorkItemEntity['type']): WorkItemType {
		switch (type) {
			case 'task':
				return WorkItemType.TASK;
			case 'keyResult':
				return WorkItemType.KEY_RESULT;
			case 'objective':
				return WorkItemType.OBJECTIVE;
			default:
				throw new UnreachableError(type);
		}
	}

	private entityToWorkItemStatus(
		status: WorkItemEntity['status']
	): WorkItemStatus {
		switch (status) {
			case 'todo':
				return WorkItemStatus.TO_DO;
			case 'inProgress':
				return WorkItemStatus.IN_PROGRESS;
			case 'done':
				return WorkItemStatus.DONE;
			case 'failed':
				return WorkItemStatus.FAILED;
			default:
				throw new UnreachableError(status);
		}
	}

	private entityToWorkItemTimeFrame(
		timeFrameEntity: WorkItemTimeFrameEntity,
		context: ContextYear
	): WorkItemTimeFrame | null {
		if (timeFrameEntity.type === 'null') {
			return null;
		}

		if (timeFrameEntity.type === 'wholeYear') {
			return new WholeYearWorkItemTimeFrame(context);
		}

		if (timeFrameEntity.type === 'quarter') {
			const quarter = this.numberToQuarter(timeFrameEntity.quarter!);
			return new QuarterWorkItemTimeFrame(context, quarter);
		}

		if (timeFrameEntity.type === 'customDate') {
			const start = Temporal.PlainDate.from(timeFrameEntity.startDate!);
			const end = Temporal.PlainDate.from(timeFrameEntity.endDate!);
			return new CustomDateWorkItemTimeFrame(context, start, end);
		}

		if (timeFrameEntity.type === 'sprint') {
			const startDate = Temporal.PlainDate.from(
				timeFrameEntity.sprint!.startDate
			);
			const endDate = Temporal.PlainDate.from(
				timeFrameEntity.sprint!.endDate
			);

			// Determine quarter from start date
			const month = startDate.month;
			const timeQuarter =
				month <= 3
					? TimeQuarter.Q1
					: month <= 6
						? TimeQuarter.Q2
						: month <= 9
							? TimeQuarter.Q3
							: TimeQuarter.Q4;

			const sprint = new Sprint(
				new SprintId(timeFrameEntity.sprint!.id),
				Year.of(startDate.year),
				timeQuarter,
				0, // yearlyIndex - not available from entity, using default
				startDate,
				endDate,
				SprintStatus.ACTIVE // status - not available from entity, using default
			);
			return new SprintWorkItemTimeFrame(context, sprint);
		}

		throw new Error('Unknown time frame type');
	}

	private numberToQuarter(quarter: 1 | 2 | 3 | 4): Quarter {
		switch (quarter) {
			case 1:
				return Quarter.Q1;
			case 2:
				return Quarter.Q2;
			case 3:
				return Quarter.Q3;
			case 4:
				return Quarter.Q4;
			default:
				throw new UnreachableError(quarter);
		}
	}

	private entityToWorkItemProgress(
		progressEntity: WorkItemProgressEntity
	): WorkItemProgress {
		if (progressEntity.type === 'manual') {
			return new ManualWorkItemProgress(
				Percentage.from(progressEntity.manualProgress ?? 0)
			);
		}

		if (progressEntity.type === 'childrenProgressBased') {
			return new ChildrenProgressBasedWorkItemProgress();
		}

		if (progressEntity.type === 'ChildrenStatusBased') {
			return new ChildrenStatusBasedWorkItemProgress();
		}

		throw new Error('Unknown progress type');
	}
}

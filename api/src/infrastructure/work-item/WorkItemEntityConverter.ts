import { Injectable } from '@nestjs/common';
import { WorkItem } from '../../domain/work-item/model/WorkItem';
import { WorkItemEntity } from './entity/WorkItemEntity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
import { Quarter, quarterToNumber } from '../../domain/common/model/Quarter';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { WorkItemId } from '../../domain/work-item/model/WorkItemId';
import { ContextYear } from '../../domain/common/model/ContextYear';
import { WorkItemTitle } from '../../domain/work-item/model/WorkItemTitle';
import { WorkItemDescription } from '../../domain/work-item/model/WorkItemDescription';
import { Temporal } from 'temporal-polyfill';
import { SprintId } from '../../domain/sprint/model/SprintId';
import { SprintService } from '../../app/sprint/SprintService';
import { WorkItemType } from '../../domain/work-item/model/WorkItemType';
import { Task } from '../../domain/work-item/model/Task';
import { LexicalRank } from '../../domain/common/model/LexicalRank';
import { Goal } from '../../domain/work-item/model/Goal';
import { Group } from '../../domain/work-item/model/Group';

@Injectable()
export class WorkItemEntityConverter {
	constructor(
		@InjectRepository(WorkItemEntity)
		private readonly workItemRepository: Repository<WorkItemEntity>,
		private readonly sprintService: SprintService
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
			user: { id: user.id.id },
			parent: workItem.parent ? { id: workItem.parent.id.id } : null,
			hierarchyOrder: workItem.hierarchyOrder?.asString(),
			sprintOverviewOrder: workItem.sprintOverviewOrder?.asString()
		});
	}

	private workItemTypeToEntity(type: WorkItemType): WorkItemEntity['type'] {
		switch (type) {
			case WorkItemType.TASK:
				return 'task';
			case WorkItemType.GOAL:
				return 'goal';
			case WorkItemType.GROUP:
				return 'group';
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
			return { type: 'null', sprint: null };
		}

		if (timeFrame instanceof WholeYearWorkItemTimeFrame) {
			return { type: 'wholeYear', sprint: null };
		}

		if (timeFrame instanceof QuarterWorkItemTimeFrame) {
			return {
				type: 'quarter',
				quarter: quarterToNumber(timeFrame.quarter),
				sprint: null
			};
		}

		if (timeFrame instanceof CustomDateWorkItemTimeFrame) {
			return {
				type: 'customDate',
				startDate: timeFrame.getStart().toString(),
				endDate: timeFrame.getEnd().toString(),
				sprint: null
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

	async entityToWorkItem(entity: WorkItemEntity): Promise<WorkItem> {
		let workItem: WorkItem | null = null;

		switch (entity.type) {
			case 'task':
				workItem = new Task(
					new WorkItemId(entity.id),
					new ContextYear(entity.contextYear),
					new WorkItemTitle(entity.title),
					new WorkItemDescription(entity.description),
					this.entityToWorkItemStatus(entity.status),
					await this.entityToWorkItemTimeFrame(
						entity.timeFrame,
						new ContextYear(entity.contextYear)
					),
					entity.hierarchyOrder
						? LexicalRank.fromString(entity.hierarchyOrder)
						: null,
					entity.sprintOverviewOrder
						? LexicalRank.fromString(entity.sprintOverviewOrder)
						: null
				);
				break;
			case 'goal':
				workItem = new Goal(
					new WorkItemId(entity.id),
					new ContextYear(entity.contextYear),
					new WorkItemTitle(entity.title),
					new WorkItemDescription(entity.description),
					this.entityToWorkItemStatus(entity.status),
					await this.entityToWorkItemTimeFrame(
						entity.timeFrame,
						new ContextYear(entity.contextYear)
					),
					entity.hierarchyOrder
						? LexicalRank.fromString(entity.hierarchyOrder)
						: null,
					entity.sprintOverviewOrder
						? LexicalRank.fromString(entity.sprintOverviewOrder)
						: null
				);
				break;
			case 'group':
				workItem = new Group(
					new WorkItemId(entity.id),
					new ContextYear(entity.contextYear),
					new WorkItemTitle(entity.title),
					new WorkItemDescription(entity.description),
					this.entityToWorkItemStatus(entity.status),
					await this.entityToWorkItemTimeFrame(
						entity.timeFrame,
						new ContextYear(entity.contextYear)
					),
					entity.hierarchyOrder
						? LexicalRank.fromString(entity.hierarchyOrder)
						: null,
					entity.sprintOverviewOrder
						? LexicalRank.fromString(entity.sprintOverviewOrder)
						: null
				);
				break;
			default:
				throw new UnreachableError(entity.type);
		}

		for (const childEntity of entity.children ?? []) {
			const child = await this.entityToWorkItem(childEntity);
			child.parent = workItem;
		}

		return workItem;
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

	private async entityToWorkItemTimeFrame(
		timeFrameEntity: WorkItemTimeFrameEntity,
		context: ContextYear
	): Promise<WorkItemTimeFrame | null> {
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
			const sprint = await this.sprintService.getSprintById(
				new SprintId(timeFrameEntity.sprint!.id)
			);
			if (!sprint) {
				throw new Error('Unable to find sprint');
			}
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
}

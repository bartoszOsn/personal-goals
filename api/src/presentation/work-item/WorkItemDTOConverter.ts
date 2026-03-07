import { Injectable } from '@nestjs/common';
import { WorkItem } from '../../domain/work-item/model/WorkItem';
import {
	WorkItemDTO,
	WorkItemProgressDTO,
	WorkItemStatusDTO,
	WorkItemTimeFrameDTO,
	WorkItemTypeDTO,
	WorkItemUpdateRequestDTO
} from '@personal-okr/shared';
import { WorkItemType } from '../../domain/work-item/model/WorkItemType';
import { WorkItemUpdateRequest } from '../../domain/work-item/model/WorkItemUpdateRequest';
import { WorkItemId } from '../../domain/work-item/model/WorkItemId';
import { WorkItemStatus } from '../../domain/work-item/model/WorkItemStatus';
import { UnreachableError } from '../../util/UnreachableError';
import {
	ManualWorkItemProgress,
	Percentage,
	WorkItemProgress
} from '../../domain/work-item/model/WorkItemProgress';
import {
	CustomDateWorkItemTimeFrame,
	QuarterWorkItemTimeFrame,
	SprintWorkItemTimeFrame,
	WholeYearWorkItemTimeFrame,
	WorkItemTimeFrame
} from '../../domain/work-item/model/WorkItemTimeFrame';
import { Quarter } from '../../domain/work-item/model/Quarter';
import { ContextYear } from '../../domain/work-item/model/ContextYear';
import { WorkItemTitle } from '../../domain/work-item/model/WorkItemTitle';
import { WorkItemDescription } from '../../domain/work-item/model/WorkItemDescription';
import { Temporal } from 'temporal-polyfill';
import { TimeService } from '../../app/time/TimeService';
import { SprintId } from '../../domain/time/model/SprintId';

@Injectable()
export class WorkItemDTOConverter {
	constructor(private readonly timeService: TimeService) {}

	toWorkItemsDTO(workItems: WorkItem[]): WorkItemDTO[] {
		return workItems.map((wi) => this.toWorkItemDTO(wi));
	}

	toWorkItemDTO(workItem: WorkItem): WorkItemDTO {
		return {
			id: workItem.id.id,
			type: this.toWorkItemTypeDTO(workItem.type),
			contextYear: workItem.contextYear.year,
			title: workItem.title.title,
			description: workItem.description.description,
			timeFrame: this.toWorkItemTimeFrameDTO(workItem.timeFrame),
			status: this.toWorkItemStatusDTO(workItem.status),
			progress: this.toWorkItemProgressDTO(workItem.progress),
			children: workItem.children.map((child) =>
				this.toWorkItemDTO(child)
			)
		};
	}

	fromWorkItemTypeDTO(type: WorkItemTypeDTO): WorkItemType {
		switch (type) {
			case 'task':
				return WorkItemType.TASK;
			case 'objective':
				return WorkItemType.OBJECTIVE;
			case 'keyResult':
				return WorkItemType.KEY_RESULT;
			default:
				throw new UnreachableError(type);
		}
	}

	private toWorkItemTypeDTO(type: WorkItemType): WorkItemTypeDTO {
		switch (type) {
			case WorkItemType.TASK:
				return 'task';
			case WorkItemType.OBJECTIVE:
				return 'objective';
			case WorkItemType.KEY_RESULT:
				return 'keyResult';
			default:
				throw new UnreachableError(type);
		}
	}

	async fromWorkItemUpdateRequestDTO(
		id: WorkItemId,
		requestRaw: WorkItemUpdateRequestDTO
	): Promise<WorkItemUpdateRequest> {
		return new WorkItemUpdateRequest(
			id,
			requestRaw.contextYear === undefined
				? undefined
				: new ContextYear(requestRaw.contextYear),
			requestRaw.type === undefined
				? undefined
				: this.fromWorkItemTypeDTO(requestRaw.type),
			requestRaw.title === undefined
				? undefined
				: new WorkItemTitle(requestRaw.title),
			requestRaw.description === undefined
				? undefined
				: new WorkItemDescription(requestRaw.description),
			requestRaw.timeFrame === undefined
				? undefined
				: await this.fromTimeFrameRequestDTO(requestRaw.timeFrame),
			requestRaw.status === undefined
				? undefined
				: this.fromWorkItemStatusDTO(requestRaw.status),
			requestRaw.progress === undefined
				? undefined
				: new ManualWorkItemProgress(
						Percentage.from(requestRaw.progress)
					)
		);
	}

	private toWorkItemStatusDTO(status: WorkItemStatus): WorkItemStatusDTO {
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

	private toWorkItemProgressDTO(
		progress: WorkItemProgress
	): WorkItemProgressDTO {
		return {
			progress: progress.getPercentage().value,
			canChange: progress.canChange()
		};
	}

	private toWorkItemTimeFrameDTO(
		timeFrame: WorkItemTimeFrame | null
	): WorkItemTimeFrameDTO | undefined {
		if (!timeFrame) {
			return undefined;
		}

		const startDate = timeFrame.getStart().toString();
		const endDate = timeFrame.getEnd().toString();
		const context = timeFrame.context.year;

		if (timeFrame instanceof WholeYearWorkItemTimeFrame) {
			return {
				type: 'whole-year',
				startDate,
				endDate,
				context
			};
		}

		if (timeFrame instanceof QuarterWorkItemTimeFrame) {
			const quarterToNumMap = {
				[Quarter.Q1]: 1,
				[Quarter.Q2]: 2,
				[Quarter.Q3]: 3,
				[Quarter.Q4]: 4
			} as const;

			return {
				type: 'quarter',
				startDate,
				endDate,
				context,
				quarter: quarterToNumMap[timeFrame.quarter]
			};
		}

		if (timeFrame instanceof CustomDateWorkItemTimeFrame) {
			return {
				type: 'custom-date',
				startDate,
				endDate,
				context
			};
		}

		if (timeFrame instanceof SprintWorkItemTimeFrame) {
			return {
				type: 'sprint',
				startDate,
				endDate,
				context,
				sprintId: timeFrame.sprint.id.value
			};
		}

		throw new Error('UnreachableError');
	}

	private async fromTimeFrameRequestDTO(
		timeFrame: NonNullable<WorkItemUpdateRequestDTO['timeFrame']>
	): Promise<WorkItemTimeFrame | null> {
		if ('empty' in timeFrame) {
			return null;
		}

		const context = new ContextYear(timeFrame.value.context);
		const quarterMap = {
			[1]: Quarter.Q1,
			[2]: Quarter.Q2,
			[3]: Quarter.Q3,
			[4]: Quarter.Q4
		} as const;

		switch (timeFrame.value.type) {
			case 'whole-year':
				return new WholeYearWorkItemTimeFrame(context);
			case 'quarter':
				return new QuarterWorkItemTimeFrame(
					context,
					quarterMap[timeFrame.value.quarter]
				);
			case 'custom-date':
				return new CustomDateWorkItemTimeFrame(
					context,
					Temporal.PlainDate.from(timeFrame.value.startDate),
					Temporal.PlainDate.from(timeFrame.value.endDate)
				);
			case 'sprint':
				return new SprintWorkItemTimeFrame(
					context,
					await this.timeService.getSprintById(
						new SprintId(timeFrame.value.sprintId)
					)
				);
		}
	}

	private fromWorkItemStatusDTO(status: WorkItemStatusDTO): WorkItemStatus {
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
}

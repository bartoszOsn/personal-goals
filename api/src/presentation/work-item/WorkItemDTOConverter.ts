import { Injectable } from '@nestjs/common';
import { SprintService } from '../../app/sprint/SprintService';
import {
	WorkItemDTO,
	WorkItemHierarchyDTO,
	WorkItemHierarchyMoveRequestDTO,
	WorkItemMoveOrderDTO,
	WorkItemProgressDTO,
	WorkItemSprintOverviewDTO,
	WorkItemSprintOverviewMoveRequestDTO,
	WorkItemStatusDTO,
	WorkItemsUpdateRequestDTO,
	WorkItemTimeFrameDTO,
	WorkItemTypeDTO
} from '@personal-okr/shared';
import { WorkHierarchyForContextAggregate } from '../../domain/work-item/aggregate/WorkHierarchyForContextAggregate';
import { WorkItem } from '../../domain/work-item/model/WorkItem';
import { UnreachableError } from '../../util/UnreachableError';
import { WorkItemType } from '../../domain/work-item/model/WorkItemType';
import { WorkItemStatus } from '../../domain/work-item/model/WorkItemStatus';
import { WorkItemProgress } from '../../domain/work-item/model/WorkItemProgress';
import { Quarter } from '../../domain/common/model/Quarter';
import {
	CustomDateWorkItemTimeFrame,
	QuarterWorkItemTimeFrame,
	SprintWorkItemTimeFrame,
	WholeYearWorkItemTimeFrame,
	WorkItemTimeFrame
} from '../../domain/work-item/model/WorkItemTimeFrame';
import {
	WorkItemsUpdateRequest,
	WorkItemUpdateRequest
} from '../../domain/work-item/model/WorkItemsUpdateRequest';
import { WorkItemId } from '../../domain/work-item/model/WorkItemId';
import { WorkItemTitle } from '../../domain/work-item/model/WorkItemTitle';
import { WorkItemDescription } from '../../domain/work-item/model/WorkItemDescription';
import { ContextYear } from '../../domain/common/model/ContextYear';
import { Temporal } from 'temporal-polyfill';
import { SprintId } from '../../domain/sprint/model/SprintId';
import { WorkItemHierarchyMoveRequest } from '../../domain/work-item/model/WorkItemHierarchyMoveRequest';
import {
	MoveRequestOrder,
	WorkItemHierarchyMoveRequestOrderType
} from '../../domain/work-item/model/MoveRequestOrder';
import { TaskSprintOverviewAggregate } from '../../domain/work-item/aggregate/TaskSprintOverviewAggregate';
import { SprintOverviewMoveRequest } from '../../domain/work-item/model/SprintOverviewMoveRequest';

@Injectable()
export class WorkItemDTOConverter {
	constructor(private readonly sprintService: SprintService) {}

	toWorkItemHierarchyDTO(
		hierarchy: WorkHierarchyForContextAggregate
	): WorkItemHierarchyDTO {
		return {
			context: hierarchy.context.year,
			roots: hierarchy.roots.map((root) => this.toWorkItemDTO(root))
		};
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

	toWorkItemType(dto: WorkItemTypeDTO): WorkItemType {
		switch (dto) {
			case 'goal':
				return WorkItemType.GOAL;
			case 'group':
				return WorkItemType.GROUP;
			case 'task':
				return WorkItemType.TASK;
			default:
				throw new UnreachableError(dto);
		}
	}

	async toWorkItemsUpdateRequest(
		dto: WorkItemsUpdateRequestDTO
	): Promise<WorkItemsUpdateRequest> {
		const updates: WorkItemUpdateRequest[] = [];

		for (const [id, update] of Object.entries(dto.updates)) {
			updates.push(
				new WorkItemUpdateRequest(
					new WorkItemId(id),
					update.title !== undefined
						? new WorkItemTitle(update.title)
						: undefined,
					update.description !== undefined
						? new WorkItemDescription(update.description)
						: undefined,
					update.timeFrame !== undefined
						? await this.fromTimeFrameRequestDTO(update.timeFrame)
						: undefined,
					update.status !== undefined
						? this.fromWorkItemStatusDTO(update.status)
						: undefined
				)
			);
		}

		return new WorkItemsUpdateRequest(updates);
	}

	toWorkItemHierarchyMoveRequest(
		dto: WorkItemHierarchyMoveRequestDTO
	): WorkItemHierarchyMoveRequest {
		return new WorkItemHierarchyMoveRequest(
			new WorkItemId(dto.id),
			dto.parentId === null ? null : new WorkItemId(dto.parentId),
			this.toMoveRequestOrder(dto.order)
		);
	}

	toWorkItemSprintOverviewDTO(
		overview: TaskSprintOverviewAggregate
	): WorkItemSprintOverviewDTO {
		return {
			sprintId: overview.sprint.id.value,
			tasks: overview.tasks.map((task) => this.toWorkItemDTO(task))
		};
	}

	toSprintOverviewMoveRequest(
		dto: WorkItemSprintOverviewMoveRequestDTO
	): SprintOverviewMoveRequest {
		return new SprintOverviewMoveRequest(
			new WorkItemId(dto.id),
			this.toMoveRequestOrder(dto.order)
		);
	}

	toWorkItemStatus(dto: WorkItemStatusDTO): WorkItemStatus {
		switch (dto) {
			case 'todo':
				return WorkItemStatus.TO_DO;
			case 'inProgress':
				return WorkItemStatus.IN_PROGRESS;
			case 'done':
				return WorkItemStatus.DONE;
			case 'failed':
				return WorkItemStatus.FAILED;
			default:
				throw new UnreachableError(dto);
		}
	}

	private toWorkItemTypeDTO(type: WorkItemType): WorkItemTypeDTO {
		switch (type) {
			case WorkItemType.TASK:
				return 'task';
			case WorkItemType.GROUP:
				return 'group';
			case WorkItemType.GOAL:
				return 'goal';
			default:
				throw new UnreachableError(type);
		}
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
			completed: progress.completed.value,
			failed: progress.failed.value
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
		timeFrame: WorkItemTimeFrameDTO
	): Promise<WorkItemTimeFrame | null> {
		if ('empty' in timeFrame) {
			return null;
		}

		const context = new ContextYear(timeFrame.context);
		const quarterMap = {
			[1]: Quarter.Q1,
			[2]: Quarter.Q2,
			[3]: Quarter.Q3,
			[4]: Quarter.Q4
		} as const;

		switch (timeFrame.type) {
			case 'whole-year':
				return new WholeYearWorkItemTimeFrame(context);
			case 'quarter':
				return new QuarterWorkItemTimeFrame(
					context,
					quarterMap[timeFrame.quarter]
				);
			case 'custom-date':
				return new CustomDateWorkItemTimeFrame(
					context,
					Temporal.PlainDate.from(timeFrame.startDate),
					Temporal.PlainDate.from(timeFrame.endDate)
				);
			case 'sprint': {
				const sprint = await this.sprintService.getSprintById(
					new SprintId(timeFrame.sprintId)
				);
				if (!sprint) {
					throw new Error('Sprint not found');
				}
				return new SprintWorkItemTimeFrame(context, sprint);
			}
		}
	}

	private toMoveRequestOrder(order: WorkItemMoveOrderDTO): MoveRequestOrder {
		switch (order.type) {
			case 'FIRST':
				return new MoveRequestOrder(
					WorkItemHierarchyMoveRequestOrderType.FIRST
				);
			case 'LAST':
				return new MoveRequestOrder(
					WorkItemHierarchyMoveRequestOrderType.LAST
				);
			case 'BETWEEN':
				return new MoveRequestOrder(
					WorkItemHierarchyMoveRequestOrderType.BETWEEN,
					new WorkItemId(order.after),
					new WorkItemId(order.before)
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

import {
	WorkItemDTO,
	WorkItemHierarchyCreateRequestDTO,
	WorkItemHierarchyDTO,
	WorkItemHierarchyMoveRequestDTO,
	WorkItemMoveOrderDTO,
	WorkItemProgressDTO,
	WorkItemSprintOverviewDTO,
	WorkItemSprintOverviewMoveRequestDTO,
	WorkItemStatusDTO,
	WorkItemsUpdateRequestDTO,
	WorkItemTimeFrameDTO,
	WorkItemTypeDTO,
	WorkItemUpdateRequestDTO
} from '@personal-okr/shared';
import {
	CustomDateWorkItemTimeFrame,
	QuarterWorkItemTimeFrame,
	SprintWorkItemTimeFrame,
	WholeYearWorkItemTimeFrame,
	WorkItem,
	WorkItemHierarchyCreateRequest,
	WorkItemHierarchyMoveRequest,
	WorkItemId,
	WorkItemMoveOrder,
	WorkItemProgress,
	WorkItemSprintOverviewMoveRequest,
	WorkItemsUpdateRequest,
	WorkItemStatus,
	WorkItemTimeFrame,
	WorkItemTimeFrameType,
	WorkItemType,
	WorkItemUpdateRequest
} from '@/models/WorkItem';
import { Temporal } from 'temporal-polyfill';
import { SprintId } from '@/models/Sprint';
import { numberToQuarter, quarterToNumber } from '@/models/Quarter';

export interface WorkItemHierarchy {
	readonly context: number;
	readonly roots: WorkItem[];
}

export interface WorkItemSprintOverview {
	readonly sprintId: SprintId;
	readonly tasks: WorkItem[];
}

// DTO to Model converters
export function dtoToWorkItemHierarchy(dto: WorkItemHierarchyDTO): WorkItemHierarchy {
	return {
		context: dto.context,
		roots: dto.roots.map(dtoToWorkItem)
	};
}

export function dtoToWorkItemSprintOverview(dto: WorkItemSprintOverviewDTO): WorkItemSprintOverview {
	return {
		sprintId: dto.sprintId as SprintId,
		tasks: dto.tasks.map(dtoToWorkItem)
	};
}

export function dtoToWorkItem(dto: WorkItemDTO): WorkItem {
	return {
		id: dto.id as WorkItemId,
		type: dtoToWorkItemType(dto.type),
		contextYear: dto.contextYear,
		title: dto.title,
		description: dto.description,
		timeFrame: dto.timeFrame ? dtoToWorkItemTimeFrame(dto.timeFrame) : null,
		status: dtoToWorkItemStatus(dto.status),
		progress: dtoToWorkItemProgress(dto.progress),
		children: dto.children.map(dtoToWorkItem)
	};
}

function dtoToWorkItemType(dto: WorkItemTypeDTO): WorkItemType {
	switch (dto) {
		case 'task':
			return WorkItemType.TASK;
		case 'goal':
			return WorkItemType.GOAL;
		case 'group':
			return WorkItemType.GROUP;
		default:
			throw new Error(`Unknown work item type: ${dto}`);
	}
}

function dtoToWorkItemStatus(dto: WorkItemStatusDTO): WorkItemStatus {
	switch (dto) {
		case 'todo':
			return WorkItemStatus.TODO;
		case 'inProgress':
			return WorkItemStatus.IN_PROGRESS;
		case 'done':
			return WorkItemStatus.DONE;
		case 'failed':
			return WorkItemStatus.FAILED;
		default:
			throw new Error(`Unknown work item status: ${dto}`);
	}
}

function dtoToWorkItemProgress(dto: WorkItemProgressDTO): WorkItemProgress {
	return {
		completed: dto.completed,
		failed: dto.failed === 100
	};
}

function dtoToWorkItemTimeFrame(dto: WorkItemTimeFrameDTO): WorkItemTimeFrame {
	const base = {
		startDate: Temporal.PlainDate.from(dto.startDate),
		endDate: Temporal.PlainDate.from(dto.endDate),
		context: dto.context
	};

	switch (dto.type) {
		case 'whole-year':
			return {
				...base,
				type: WorkItemTimeFrameType.WHOLE_YEAR
			} as WholeYearWorkItemTimeFrame;
		case 'quarter':
			return {
				...base,
				type: WorkItemTimeFrameType.QUARTER,
				quarter: numberToQuarter[dto.quarter]
			} as QuarterWorkItemTimeFrame;
		case 'custom-date':
			return {
				...base,
				type: WorkItemTimeFrameType.CUSTOM_DATE
			} as CustomDateWorkItemTimeFrame;
		case 'sprint':
			return {
				...base,
				type: WorkItemTimeFrameType.SPRINT,
				sprintId: dto.sprintId as SprintId
			} as SprintWorkItemTimeFrame;
		default:
			throw new Error(`Unknown work item time frame type`);
	}
}

// Model to DTO converters
export function workItemHierarchyCreateRequestToDTO(
	request: WorkItemHierarchyCreateRequest
): WorkItemHierarchyCreateRequestDTO {
	return {
		type: workItemTypeToDTO(request.type),
		parentId: request.parentId
	};
}

export function workItemsUpdateRequestToDTO(
	request: WorkItemsUpdateRequest
): WorkItemsUpdateRequestDTO {
	return {
		updates: Object.fromEntries(
			Object.entries(request.updates).map(([id, update]) => [
				id,
				workItemUpdateRequestToDTO(update)
			])
		)
	};
}

export function workItemUpdateRequestToDTO(
	request: WorkItemUpdateRequest
): WorkItemUpdateRequestDTO {
	return {
		title: request.title,
		description: request.description,
		timeFrame: request.timeFrame !== undefined
			? (request.timeFrame === null ? undefined : workItemTimeFrameToDTO(request.timeFrame))
			: undefined,
		status: request.status ? workItemStatusToDTO(request.status) : undefined
	};
}

export function workItemHierarchyMoveRequestToDTO(
	request: WorkItemHierarchyMoveRequest
): WorkItemHierarchyMoveRequestDTO {
	return {
		id: request.id,
		parentId: request.parentId,
		order: workItemMoveOrderToDTO(request.order)
	};
}

export function workItemSprintOverviewMoveRequestToDTO(
	request: WorkItemSprintOverviewMoveRequest
): WorkItemSprintOverviewMoveRequestDTO {
	return {
		id: request.id,
		order: workItemMoveOrderToDTO(request.order)
	};
}

function workItemTypeToDTO(type: WorkItemType): WorkItemTypeDTO {
	switch (type) {
		case WorkItemType.TASK:
			return 'task';
		case WorkItemType.GOAL:
			return 'goal';
		case WorkItemType.GROUP:
			return 'group';
		default:
			throw new Error(`Unknown work item type: ${type}`);
	}
}

export function workItemStatusToDTO(status: WorkItemStatus): WorkItemStatusDTO {
	switch (status) {
		case WorkItemStatus.TODO:
			return 'todo';
		case WorkItemStatus.IN_PROGRESS:
			return 'inProgress';
		case WorkItemStatus.DONE:
			return 'done';
		case WorkItemStatus.FAILED:
			return 'failed';
		default:
			throw new Error(`Unknown work item status: ${status}`);
	}
}

function workItemTimeFrameToDTO(timeFrame: WorkItemTimeFrame): WorkItemTimeFrameDTO {
	const base = {
		startDate: timeFrame.startDate.toString(),
		endDate: timeFrame.endDate.toString(),
		context: timeFrame.context
	};

	switch (timeFrame.type) {
		case WorkItemTimeFrameType.WHOLE_YEAR:
			return {
				...base,
				type: 'whole-year'
			};
		case WorkItemTimeFrameType.QUARTER:
			return {
				...base,
				type: 'quarter',
				quarter: quarterToNumber[timeFrame.quarter]
			};
		case WorkItemTimeFrameType.CUSTOM_DATE:
			return {
				...base,
				type: 'custom-date'
			};
		case WorkItemTimeFrameType.SPRINT:
			return {
				...base,
				type: 'sprint',
				sprintId: timeFrame.sprintId
			};
		default:
			throw new Error(`Unknown work item time frame type`);
	}
}

function workItemMoveOrderToDTO(order: WorkItemMoveOrder): WorkItemMoveOrderDTO {
	switch (order.type) {
		case 'FIRST':
			return { type: 'FIRST' };
		case 'LAST':
			return { type: 'LAST' };
		case 'BETWEEN':
			return { type: 'BETWEEN', after: order.after, before: order.before };
		default:
			throw new Error(`Unknown work item move order type`);
	}
}

import {
	WorkItemCreationRequestDTO,
	WorkItemDTO,
	WorkItemStatusDTO,
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
	WorkItemCreationRequest,
	WorkItemId,
	WorkItemProgress,
	WorkItemStatus,
	WorkItemTimeFrame,
	WorkItemTimeFrameType,
	WorkItemType,
	WorkItemUpdateRequest
} from '@/models/WorkItem';
import { Temporal } from 'temporal-polyfill';
import { SprintId } from '@/models/Sprint';

export function dtoToWorkItems(dtos: WorkItemDTO[]): WorkItem[] {
	return dtos.map(dtoToWorkItem);
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
		progress: dtoToWorkItemProgress(dto.progress)
	};
}

export function workItemCreationRequestToDTO(request: WorkItemCreationRequest): WorkItemCreationRequestDTO {
	return {
		context: request.context,
		type: workItemTypeToDTO(request.type),
		parentId: request.parentId
	};
}

export function workItemUpdateRequestToDTO(request: WorkItemUpdateRequest): WorkItemUpdateRequestDTO {
	const timeFrameToDTO = (timeFrame?: WorkItemTimeFrame | null) => {
		if (timeFrame === undefined) {
			return undefined;
		}

		if (timeFrame === null) {
			return { empty: true } as const;
		}

		return { value: workItemTimeFrameToDTO(timeFrame) };
	};

	return {
		contextYear: request.contextYear,
		type: request.type ? workItemTypeToDTO(request.type) : undefined,
		title: request.title,
		description: request.description,
		timeFrame: timeFrameToDTO(request.timeFrame),
		status: request.status ? workItemStatusToDTO(request.status) : undefined,
		progress: request.progress
	};
}

function dtoToWorkItemType(dto: WorkItemTypeDTO): WorkItemType {
	switch (dto) {
		case 'task':
			return WorkItemType.TASK;
		case 'objective':
			return WorkItemType.OBJECTIVE;
		case 'keyResult':
			return WorkItemType.KEY_RESULT;
		default:
			throw new Error(`Unknown work item type: ${dto}`);
	}
}

function workItemTypeToDTO(type: WorkItemType): WorkItemTypeDTO {
	switch (type) {
		case WorkItemType.TASK:
			return 'task';
		case WorkItemType.OBJECTIVE:
			return 'objective';
		case WorkItemType.KEY_RESULT:
			return 'keyResult';
		default:
			throw new Error(`Unknown work item type: ${type}`);
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

function workItemStatusToDTO(status: WorkItemStatus): WorkItemStatusDTO {
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

function dtoToWorkItemProgress(dto: { progress: number; canChange: boolean }): WorkItemProgress {
	return {
		progress: dto.progress,
		canChange: dto.canChange
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
				quarter: dto.quarter
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
				quarter: timeFrame.quarter
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

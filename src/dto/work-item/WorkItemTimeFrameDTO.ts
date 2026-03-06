export interface WorkItemTimeFrameBaseDTO {
	startDate: string;
	endDate: string;
	context: number;
}

export interface WholeYearWorkItemTimeFrameDTO extends WorkItemTimeFrameBaseDTO {
	type: 'whole-year';
}

export interface QuarterWorkItemTimeFrameDTO extends WorkItemTimeFrameBaseDTO {
	type: 'quarter';
	quarter: 1 | 2 | 3 | 4;
}

export interface CustomDateWorkItemTimeFrameDTO extends WorkItemTimeFrameBaseDTO {
	type: 'custom-date';
}

export interface SprintWorkItemTimeFrameDTO extends WorkItemTimeFrameBaseDTO {
	type: 'sprint';
	sprintId: string;
}

export type WorkItemTimeFrameDTO =
	| WholeYearWorkItemTimeFrameDTO
	| QuarterWorkItemTimeFrameDTO
	| CustomDateWorkItemTimeFrameDTO
	| SprintWorkItemTimeFrameDTO;
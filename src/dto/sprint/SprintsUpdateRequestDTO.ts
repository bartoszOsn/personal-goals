export interface SprintsUpdateRequestDTO {
	[sprintId: string]: SprintUpdateRequestDTO;
}

export interface SprintUpdateRequestDTO {
	startDate?: string;
	endDate?: string;
}
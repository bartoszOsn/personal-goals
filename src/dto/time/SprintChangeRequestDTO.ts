export interface SprintChangeRequestDTO {
	[sprintId: string]: {
		newStartDate: string;
		newEndDate: string;
	}
}
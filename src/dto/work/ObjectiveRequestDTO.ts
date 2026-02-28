import { ObjectiveDeadlineDTO } from './ObjectiveDeadlineDTO.js';

export interface ObjectiveRequestDTO {
	name?: string;
	description?: string;
	deadline?: ObjectiveDeadlineDTO;
}

import { ObjectiveDeadlineDTO } from './ObjectiveDeadlineDTO';

export interface ObjectiveRequestDTO {
	name?: string;
	description?: string;
	deadline?: ObjectiveDeadlineDTO;
}

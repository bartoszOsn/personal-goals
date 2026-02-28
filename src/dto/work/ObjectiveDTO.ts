import { KeyResultDTO } from './KeyResultDTO.js';
import { ObjectiveDeadlineDTO } from './ObjectiveDeadlineDTO.js';

export interface ObjectiveDTO {
	id: string;
	name: string;
	description: string;
	deadline: ObjectiveDeadlineDTO;
	keyResults: KeyResultDTO[];
}

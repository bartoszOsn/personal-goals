import { KeyResultDTO } from './KeyResultDTO';
import { ObjectiveDeadlineDTO } from './ObjectiveDeadlineDTO';

export interface ObjectiveDTO {
	id: string;
	name: string;
	description: string;
	deadline: ObjectiveDeadlineDTO;
	keyResults: KeyResultDTO[];
}

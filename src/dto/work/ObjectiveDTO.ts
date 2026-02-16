import type { KeyResultDTO } from './KeyResultDTO';
import type { ObjectiveDeadlineDTO } from './ObjectiveDeadlineDTO';

export interface ObjectiveDTO {
	id: string;
	name: string;
	description: string;
	deadline: ObjectiveDeadlineDTO;
	keyResults: KeyResultDTO[];
}

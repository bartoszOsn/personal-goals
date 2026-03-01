import { KeyResultDTO, ObjectiveDeadlineDTO, ObjectiveDTO, ObjectiveListDTO, ObjectiveRequestDTO } from '@personal-okr/shared';
import { Objective, ObjectiveDeadline, ObjectiveId, ObjectiveRequest } from '@/models/Objective.ts';
import { dtoToQuarter } from '@/api/sprint/sprint-converters.ts';
import { KeyResult, KeyResultId, ProgressCalculationType } from '@/models/KeyResult.ts';
import { TaskId } from '@/models/Task.ts';

export function dtoToObjectives(list: ObjectiveListDTO): Objective[] {
	return list.objectives.map(dtoToObjective);
}

export function dtoToObjective(dto: ObjectiveDTO): Objective {
	return {
		id: dto.id as ObjectiveId,
		name: dto.name,
		description: dto.description,
		deadline: dtoToObjectiveDeadline(dto.deadline),
		KeyResults: dtoToKeyResults(dto.keyResults)
	};
}

export function objectiveRequestToDTO(request: ObjectiveRequest): ObjectiveRequestDTO {
	return {
		name: request.name,
		description: request.description,
		deadline: request.deadline ? objectiveDeadlineToDTO(request.deadline) : undefined
	}
}

export function dtoToObjectiveDeadline(dto: ObjectiveDeadlineDTO): ObjectiveDeadline {
	return {
		year: dto.year,
		quarter: dto.quarter === undefined ? null : dtoToQuarter(dto.quarter)
	};
}

function objectiveDeadlineToDTO(deadline: ObjectiveDeadline): ObjectiveDeadlineDTO {
	return {
		year: deadline.year,
		quarter: deadline.quarter === null ? undefined : deadline.quarter
	}
}

export function dtoToKeyResults(dto: KeyResultDTO[]): KeyResult[] {
	return dto.map(dtoToKeyResult);
}

export function dtoToKeyResult(dto: KeyResultDTO): KeyResult {
	return {
		id: dto.id as KeyResultId,
		name: dto.name,
		description: dto.description,
		progress: dto.progress,
		progressCalculationType: dtoToProgressCalculationType(dto.progressCalculationType),
		associatedTaskIds: dto.associatedTaskIds as TaskId[]
	};
}

export function dtoToProgressCalculationType(type: KeyResultDTO['progressCalculationType']): ProgressCalculationType {
	switch (type) {
		case 'YES_NO':
			return ProgressCalculationType.YES_NO;
		case 'PERCENTAGE':
			return ProgressCalculationType.PERCENTAGE;
		case 'TASKS':
			return ProgressCalculationType.TASKS;
		default:
			throw new Error(`Invalid progress calculation type: ${type}`);
	}
}


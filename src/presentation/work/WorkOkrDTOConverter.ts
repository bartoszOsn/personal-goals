import { Injectable } from '@nestjs/common';
import { ObjectiveListDTO } from './dto/ObjectiveListDTO';
import {
	Objective,
	ObjectiveDeadline
} from '../../domain/work/model/Objective';
import { ObjectiveDTO } from './dto/ObjectiveDTO';
import { ObjectiveDeadlineDTO } from './dto/ObjectiveDeadlineDTO';
import { Quarter } from '../../domain/time/model/Quarter';
import { UnreachableError } from '../../util/UnreachableError';
import { KeyResult } from '../../domain/work/model/KeyResult';
import { KeyResultDTO } from './dto/KeyResultDTO';
import type { ObjectiveRequestDTO } from './dto/ObjectiveRequestDTO';
import { ObjectiveRequest } from '../../domain/work/model/ObjectiveRequest';
import { Year } from '../../domain/time/model/Year';
import { RichText } from '../../domain/work/model/RichText';
import { KeyResultRequestDTO } from './dto/KeyResultRequestDTO';
import { KeyResultRequest } from '../../domain/work/model/KeyResultRequest';
import { KeyResultProgress } from '../../domain/work/model/KeyResultProgress';

@Injectable()
export class WorkOkrDTOConverter {
	toObjectiveListDTO(objectives: Objective[]): ObjectiveListDTO {
		return {
			objectives: objectives.map((objective) =>
				this.toObjectiveDTO(objective)
			)
		};
	}

	toObjectiveDTO(objective: Objective): ObjectiveDTO {
		return {
			id: objective.id.id,
			name: objective.name,
			description: objective.description.markdown,
			deadline: this.toObjectiveDeadlineDTO(objective.deadline),
			keyResults: objective.keyResults.map((kr) =>
				this.toKeyResultDTO(kr)
			)
		};
	}

	toKeyResultDTO(keyResult: KeyResult): KeyResultDTO {
		return {
			id: keyResult.id.id,
			name: keyResult.name,
			description: keyResult.description.markdown,
			progress: keyResult.progress.progress
		};
	}

	fromObjectiveRequestDTO(request: ObjectiveRequestDTO): ObjectiveRequest {
		return new ObjectiveRequest(
			request.name ?? null,
			request.description ? new RichText(request.description) : null,
			request.deadline
				? this.fromObjectiveDeadlineDTO(request.deadline)
				: null
		);
	}

	fromKeyResultRequestDTO(request: KeyResultRequestDTO): KeyResultRequest {
		return new KeyResultRequest(
			request.name ?? null,
			request.description ? new RichText(request.description) : null,
			request.progress !== undefined
				? new KeyResultProgress(request.progress)
				: null
		);
	}

	private toObjectiveDeadlineDTO(
		deadline: ObjectiveDeadline
	): ObjectiveDeadlineDTO {
		return {
			year: deadline.year.getValue(),
			quarter: this.toObjectiveDeadlineDTOQuarter(deadline.quarter)
		};
	}

	private fromObjectiveDeadlineDTO(
		deadline: ObjectiveDeadlineDTO
	): ObjectiveDeadline {
		const year = Year.of(deadline.year);
		const quarter = this.fromObjectiveDeadlineDTOQuarter(deadline.quarter);

		if (quarter) {
			return ObjectiveDeadline.quarterly(year, quarter);
		}

		return ObjectiveDeadline.yearly(year);
	}

	private toObjectiveDeadlineDTOQuarter(
		quarter?: Quarter
	): ObjectiveDeadlineDTO['quarter'] {
		switch (quarter) {
			case undefined:
				return undefined;
			case Quarter.Q1:
				return 'Q1';
			case Quarter.Q2:
				return 'Q2';
			case Quarter.Q3:
				return 'Q3';
			case Quarter.Q4:
				return 'Q4';
			default:
				throw new UnreachableError(quarter);
		}
	}

	private fromObjectiveDeadlineDTOQuarter(
		quarter: ObjectiveDeadlineDTO['quarter']
	): Quarter | undefined {
		switch (quarter) {
			case undefined:
				return undefined;
			case 'Q1':
				return Quarter.Q1;
			case 'Q2':
				return Quarter.Q2;
			case 'Q3':
				return Quarter.Q3;
			case 'Q4':
				return Quarter.Q4;
			default:
				throw new UnreachableError(quarter);
		}
	}
}

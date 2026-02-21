import { Injectable } from '@nestjs/common';
import { ObjectiveEntity } from './entity/ObjectiveEntity';
import {
	Objective,
	ObjectiveDeadline,
	ObjectiveId
} from '../../domain/work/model/Objective';
import { RichText } from '../../domain/work/model/RichText';
import { Year } from '../../domain/time/model/Year';
import { Quarter } from '../../domain/time/model/Quarter';
import { UnreachableError } from '../../util/UnreachableError';
import { KeyResultEntity } from './entity/KeyResultEntity';
import { KeyResult, KeyResultId } from '../../domain/work/model/KeyResult';
import { KeyResultProgress } from '../../domain/work/model/KeyResultProgress';
import { ObjectiveRequest } from '../../domain/work/model/ObjectiveRequest';
import { User } from '../../domain/auth/model/User';
import { UserEntity } from '../auth/entity/UserEntity';
import { KeyResultRequest } from '../../domain/work/model/KeyResultRequest';
import { TaskId } from '../../domain/work/model/TaskId';

@Injectable()
export class WorkOKREntityConverter {
	fromObjectiveEntities(entities: ObjectiveEntity[]): Objective[] {
		return entities.map((entity: ObjectiveEntity) =>
			this.fromObjectiveEntity(entity)
		);
	}

	fromObjectiveEntity(entity: ObjectiveEntity): Objective {
		return new Objective(
			new ObjectiveId(entity.id),
			entity.name,
			new RichText(entity.description),
			this.objectiveEntityToDeadline(entity),
			entity.keyResults.map((kr) => this.fromKeyResultEntity(kr))
		);
	}

	toObjectiveEntity(user: User, request: ObjectiveRequest) {
		const entity = new ObjectiveEntity();
		entity.user = { id: user.id.id } as UserEntity;
		if (request.name != null) {
			entity.name = request.name;
		}

		if (request.description != null) {
			entity.description = request.description.markdown;
		}

		if (request.deadline != null) {
			entity.deadlineYear = request.deadline.year.getValue();
			entity.deadlineQuarter = this.toObjectiveEntityQuarter(
				request.deadline.quarter
			);
		}

		return entity;
	}

	toKeyResultEntity(request: KeyResultRequest): KeyResultEntity {
		const entity = new KeyResultEntity();

		if (request.name != null) {
			entity.name = request.name;
		}

		if (request.description != null) {
			entity.description = request.description.markdown;
		}

		if (request.progress != null) {
			entity.progress = request.progress.progress;
		}

		return entity;
	}

	fromKeyResultEntity(kr: KeyResultEntity): KeyResult {
		return new KeyResult(
			new KeyResultId(kr.id),
			kr.name,
			new RichText(kr.description),
			new KeyResultProgress(kr.progress),
			kr.associatedTasks.map((task) => new TaskId(task.id))
		);
	}

	private objectiveEntityToDeadline(
		entity: ObjectiveEntity
	): ObjectiveDeadline {
		const year = Year.of(entity.deadlineYear);
		const quarter = this.fromObjectiveEntityQuarter(entity.deadlineQuarter);

		if (quarter) {
			return ObjectiveDeadline.quarterly(year, quarter);
		}

		return ObjectiveDeadline.yearly(year);
	}

	private fromObjectiveEntityQuarter(
		deadlineQuarter: ObjectiveEntity['deadlineQuarter']
	): Quarter | null {
		switch (deadlineQuarter) {
			case undefined:
			case null:
				return null;
			case 'Q1':
				return Quarter.Q1;
			case 'Q2':
				return Quarter.Q2;
			case 'Q3':
				return Quarter.Q3;
			case 'Q4':
				return Quarter.Q4;
			default:
				throw new UnreachableError(deadlineQuarter);
		}
	}

	private toObjectiveEntityQuarter(
		quarter: Quarter | undefined
	): ObjectiveEntity['deadlineQuarter'] {
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
}

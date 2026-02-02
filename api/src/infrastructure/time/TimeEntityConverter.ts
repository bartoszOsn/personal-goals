import { Injectable } from '@nestjs/common';
import { SprintSettingsEntity } from './entity/SprintSettingsEntity';
import {
	SprintSettings,
	SprintSettingsDuration,
	SprintSettingsQuarterAssignment
} from '../../domain/time/model/SprintSettings';
import { UnreachableError } from '../../util/UnreachableError';
import { RestPeriod, RestPeriodId } from '../../domain/time/model/RestPeriod';
import { RestPeriodEntity } from './entity/RestPeriodEntity';
import { User } from '../../domain/auth/model/User';
import { RestPeriodRequest } from '../../domain/time/model/RestPeriodRequest';
import { UserEntity } from '../auth/entity/UserEntity';

@Injectable()
export class TimeEntityConverter {
	fromSprintSettingsEntity(entity: SprintSettingsEntity): SprintSettings {
		return new SprintSettings(
			this.fromSprintSettingsEntityDuration(entity.sprintDuration),
			this.fromSprintSettingsEntityQuarterAssignment(
				entity.quarterAssignment
			),
			entity.generateUntil
		);
	}

	toSprintSettingsEntityDuration(
		duration: SprintSettingsDuration
	): SprintSettingsEntity['sprintDuration'] {
		switch (duration) {
			case SprintSettingsDuration.WEEK:
				return 'week';
			case SprintSettingsDuration.TWO_WEEKS:
				return 'two-weeks';
			case SprintSettingsDuration.MONTH:
				return 'month';
			default:
				throw new UnreachableError(duration);
		}
	}

	toSprintSettingsEntityQuarterAssignment(
		quarterAssignment: SprintSettingsQuarterAssignment
	): SprintSettingsEntity['quarterAssignment'] {
		switch (quarterAssignment) {
			case SprintSettingsQuarterAssignment.BEGINNING:
				return 'beginning';
			case SprintSettingsQuarterAssignment.END:
				return 'end';
			case SprintSettingsQuarterAssignment.BY_MAJORITY:
				return 'by-majority';
			default:
				throw new UnreachableError(quarterAssignment);
		}
	}

	fromRestPeriodEntity(entity: RestPeriodEntity): RestPeriod {
		return new RestPeriod(
			new RestPeriodId(entity.id),
			entity.name ?? null,
			entity.start,
			entity.end
		);
	}

	toRestPeriodEntity(
		user: User,
		request: RestPeriodRequest
	): RestPeriodEntity {
		const entity = new RestPeriodEntity();
		entity.name = request.name ?? undefined;
		entity.start = request.start;
		entity.end = request.end;
		entity.user = { id: user.id.id } as unknown as UserEntity;
		return entity;
	}

	private fromSprintSettingsEntityDuration(
		duration: SprintSettingsEntity['sprintDuration']
	): SprintSettingsDuration {
		switch (duration) {
			case 'week':
				return SprintSettingsDuration.WEEK;
			case 'two-weeks':
				return SprintSettingsDuration.TWO_WEEKS;
			case 'month':
				return SprintSettingsDuration.MONTH;
			default:
				throw new UnreachableError(duration);
		}
	}

	private fromSprintSettingsEntityQuarterAssignment(
		quarterAssignment: SprintSettingsEntity['quarterAssignment']
	): SprintSettingsQuarterAssignment {
		switch (quarterAssignment) {
			case 'beginning':
				return SprintSettingsQuarterAssignment.BEGINNING;
			case 'end':
				return SprintSettingsQuarterAssignment.END;
			case 'by-majority':
				return SprintSettingsQuarterAssignment.BY_MAJORITY;
			default:
				throw new UnreachableError(quarterAssignment);
		}
	}
}

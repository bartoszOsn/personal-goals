import { Injectable } from '@nestjs/common';
import { SprintSettingsEntity } from './entity/SprintSettingsEntity';
import {
	SprintSettings,
	SprintSettingsDuration,
	SprintSettingsQuarterAssignment
} from '../../domain/time/model/SprintSettings';
import { UnreachableError } from '../../util/UnreachableError';
import { SprintTimeRangeEntity } from './entity/SprintTimeRangeEntity';
import { SprintTimeRange } from '../../domain/time/model/SprintTimeRange';
import { SprintId } from '../../domain/time/model/SprintId';
import { Temporal } from 'temporal-polyfill';

@Injectable()
export class TimeEntityConverter {
	fromSprintSettingsEntity(entity: SprintSettingsEntity): SprintSettings {
		return new SprintSettings(
			this.fromSprintSettingsEntityDuration(entity.sprintDuration),
			this.fromSprintSettingsEntityQuarterAssignment(
				entity.quarterAssignment
			),
			Temporal.PlainDate.from(entity.generateUntil)
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

	fromSprintTimeRangeEntities(
		entities: SprintTimeRangeEntity[]
	): SprintTimeRange[] {
		return entities.map((entity) => this.fromSprintTimeRangeEntity(entity));
	}

	fromSprintTimeRangeEntity(entity: SprintTimeRangeEntity): SprintTimeRange {
		return new SprintTimeRange(
			new SprintId(entity.id),
			Temporal.PlainDate.from(entity.startDate),
			Temporal.PlainDate.from(entity.endDate)
		);
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

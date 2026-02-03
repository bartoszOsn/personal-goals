import { Injectable } from '@nestjs/common';
import { Sprint } from '../../domain/time/model/Sprint';
import { SprintListDTO } from './dto/SprintListDTO';
import {
	SprintSettings,
	SprintSettingsDuration,
	SprintSettingsQuarterAssignment
} from '../../domain/time/model/SprintSettings';
import { SprintSettingsDTO } from './dto/SprintSettingsDTO';
import { RestPeriod } from '../../domain/time/model/RestPeriod';
import { RestPeriodListDTO } from './dto/RestPeriodListDTO';
import { RestPeriodRequestDTO } from './dto/RestPeriodRequestDTO';
import { RestPeriodRequest } from '../../domain/time/model/RestPeriodRequest';
import { RestPeriodDTO } from './dto/RestPeriodDTO';
import { SprintDTO } from './dto/SprintDTO';
import { Quarter } from '../../domain/time/model/Quarter';
import { QuarterDTO } from './dto/QuarterDTO';
import { UnreachableError } from '../../util/UnreachableError';
import { SprintStatus } from '../../domain/time/model/SprintStatus';

@Injectable()
export class TimeDTOConverter {
	toListDTO(sprints: Sprint[]): SprintListDTO {
		return {
			sprints: sprints.map((sprint) => this.toSprintDTO(sprint))
		};
	}

	toSettingsDTO(settings: SprintSettings): SprintSettingsDTO {
		return {
			sprintDuration: this.toSprintDurationDTO(settings.sprintDuration),
			quarterAssignment: this.toSprintQuarterAssignmentDTO(
				settings.quarterAssignment
			),
			generateUntil: settings.generateUntil.toString()
		};
	}

	fromSettingsDTO(settings: SprintSettingsDTO): SprintSettings {
		return new SprintSettings(
			this.fromSprintDurationDTO(settings.sprintDuration),
			this.fromSprintQuarterAssignmentDTO(settings.quarterAssignment),
			new Date(settings.generateUntil)
		);
	}

	toRestPeriodListDTO(restPeriods: RestPeriod[]): RestPeriodListDTO {
		return {
			restPeriods: restPeriods.map((restPeriod) =>
				this.toRestPeriodDTO(restPeriod)
			)
		};
	}

	fromRestPeriodRequestDTO(
		restPeriodCreation: RestPeriodRequestDTO
	): RestPeriodRequest {
		return new RestPeriodRequest(
			restPeriodCreation.name ?? null,
			new Date(restPeriodCreation.start),
			new Date(restPeriodCreation.end)
		);
	}

	toRestPeriodDTO(restPeriod: RestPeriod): RestPeriodDTO {
		return {
			id: restPeriod.id.getId(),
			name: restPeriod.name ?? undefined,
			start: restPeriod.start.toString(),
			end: restPeriod.end.toString()
		};
	}

	private toSprintDTO(sprint: Sprint): SprintDTO {
		return {
			year: sprint.year.getValue(),
			quarter: this.toQuarterDTO(sprint.quarter),
			yearlyIndex: sprint.yearlyIndex,
			startDate: sprint.start,
			endDate: sprint.end,
			status: this.toSprintStatusDTO(sprint.status)
		};
	}

	private toQuarterDTO(quarter: Quarter): QuarterDTO {
		switch (quarter) {
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

	private toSprintDurationDTO(
		sprintDuration: SprintSettingsDuration
	): SprintSettingsDTO['sprintDuration'] {
		switch (sprintDuration) {
			case SprintSettingsDuration.WEEK:
				return 'week';
			case SprintSettingsDuration.TWO_WEEKS:
				return 'two-weeks';
			case SprintSettingsDuration.MONTH:
				return 'month';
			default:
				throw new UnreachableError(sprintDuration);
		}
	}

	private toSprintQuarterAssignmentDTO(
		quarterAssignment: SprintSettingsQuarterAssignment
	): SprintSettingsDTO['quarterAssignment'] {
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

	private fromSprintDurationDTO(
		sprintDuration: SprintSettingsDTO['sprintDuration']
	): SprintSettingsDuration {
		switch (sprintDuration) {
			case 'week':
				return SprintSettingsDuration.WEEK;
			case 'two-weeks':
				return SprintSettingsDuration.TWO_WEEKS;
			case 'month':
				return SprintSettingsDuration.MONTH;
			default:
				throw new UnreachableError(sprintDuration);
		}
	}

	private fromSprintQuarterAssignmentDTO(
		quarterAssignment: SprintSettingsDTO['quarterAssignment']
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

	private toSprintStatusDTO(status: SprintStatus): SprintDTO['status'] {
		switch (status) {
			case SprintStatus.COMPLETED:
				return 'completed';
			case SprintStatus.ACTIVE:
				return 'active';
			case SprintStatus.FUTURE:
				return 'future';
			default:
				throw new UnreachableError(status);
		}
	}
}

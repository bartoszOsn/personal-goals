import { Injectable } from '@nestjs/common';
import { Sprint } from '../../domain/time/model/Sprint';
import { SprintListDTO } from './dto/SprintListDTO';
import { SprintSettings } from '../../domain/time/model/SprintSettings';
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

@Injectable()
export class TimeDTOConverter {
	toListDTO(sprints: Sprint[]): SprintListDTO {
		return {
			sprints: sprints.map((sprint) => this.toSprintDTO(sprint))
		};
	}

	toSettingsDTO(settings: SprintSettings): SprintSettingsDTO {
		return undefined as any; // TODO
	}

	fromSettingsDTO(settings: SprintSettingsDTO): SprintSettings {
		return undefined as any; // TODO
	}

	toRestPeriodListDTO(restPeriods: RestPeriod[]): RestPeriodListDTO {
		return undefined as any; // TODO
	}

	fromRestPeriodRequestDTO(
		restPeriodCreation: RestPeriodRequestDTO
	): RestPeriodRequest {
		return undefined as any; // TODO
	}

	toRestPeriodDTO(restPeriod: RestPeriod): RestPeriodDTO {
		return undefined as any;
	}

	private toSprintDTO(sprint: Sprint): SprintDTO {
		return {
			year: sprint.year.getValue(),
			quarter: this.toQuarterDTO(sprint.quarter),
			yearlyIndex: sprint.yearlyIndex,
			startDate: sprint.start,
			endDate: sprint.end
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
}

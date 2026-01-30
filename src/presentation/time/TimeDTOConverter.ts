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

@Injectable()
export class TimeDTOConverter {
	toListDTO(sprints: Sprint[]): SprintListDTO {
		return {
			sprints: [] // TODO
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
}

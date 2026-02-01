import { Injectable } from '@nestjs/common';
import { SprintSettings } from './model/SprintSettings';
import { RestPeriod } from './model/RestPeriod';
import { Sprint } from './model/Sprint';

@Injectable()
export class TimeSprintCalculationService {
	calculateSprints(
		settings: SprintSettings,
		restPeriods: RestPeriod[]
	): Sprint[] {
		return [];
	}
}

import { Injectable } from '@nestjs/common';
import { Sprint } from '../../domain/time/model/Sprint';
import { SprintSettings } from '../../domain/time/model/SprintSettings';
import { RestPeriod, RestPeriodId } from '../../domain/time/model/RestPeriod';
import { RestPeriodRequest } from '../../domain/time/model/RestPeriodRequest';

@Injectable()
export class TimeService {
	public getSprints(): Promise<Sprint[]> {
		return Promise.resolve([]);
	}

	public getSprintSettings(): Promise<SprintSettings> {
		return Promise.resolve(SprintSettings);
	}

	public updateSprintSettings(settings: SprintSettings): Promise<void> {
		return Promise.resolve();
	}

	public getRestPeriods(): Promise<RestPeriod[]> {
		return Promise.resolve([]);
	}

	public addRestPeriod(request: RestPeriodRequest): Promise<RestPeriod> {
		return Promise.resolve(null as any);
	}

	public updateRestPeriod(
		restPeriodId: RestPeriodId,
		request: RestPeriodRequest
	): Promise<RestPeriod> {
		return Promise.resolve(null as any);
	}

	public deleteRestPeriod(restPeriodId: RestPeriodId): Promise<void> {
		return Promise.resolve();
	}
}

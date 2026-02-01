import { Injectable } from '@nestjs/common';
import { Sprint } from '../../domain/time/model/Sprint';
import { SprintSettings } from '../../domain/time/model/SprintSettings';
import { RestPeriod, RestPeriodId } from '../../domain/time/model/RestPeriod';
import { RestPeriodRequest } from '../../domain/time/model/RestPeriodRequest';
import { TimeRepository } from './TimeRepository';
import { UserStorage } from '../auth/UserStorage';
import { TimeSprintCalculationService } from '../../domain/time/TimeSprintCalculationService';

@Injectable()
export class TimeService {
	public constructor(
		private readonly timeRepository: TimeRepository,
		private readonly timeSprintCalculationService: TimeSprintCalculationService,
		private readonly userStorage: UserStorage
	) {}

	public async getSprints(): Promise<Sprint[]> {
		const settings = await this.getSprintSettings();
		const restPeriods = await this.getRestPeriods();

		return this.timeSprintCalculationService.calculateSprints(
			settings,
			restPeriods
		);
	}

	public async getSprintSettings(): Promise<SprintSettings> {
		const user = await this.userStorage.getUser();
		return (
			(await this.timeRepository.getSprintSettings(user)) ??
			SprintSettings.default
		);
	}

	public async updateSprintSettings(settings: SprintSettings): Promise<void> {
		const user = await this.userStorage.getUser();
		await this.timeRepository.updateSprintSettings(user, settings);
	}

	public async getRestPeriods(): Promise<RestPeriod[]> {
		const user = await this.userStorage.getUser();
		return this.timeRepository.getRestPeriods(user);
	}

	public async addRestPeriod(
		request: RestPeriodRequest
	): Promise<RestPeriod> {
		const user = await this.userStorage.getUser();
		return this.timeRepository.addRestPeriod(user, request);
	}

	public async updateRestPeriod(
		restPeriodId: RestPeriodId,
		request: RestPeriodRequest
	): Promise<RestPeriod> {
		const user = await this.userStorage.getUser();
		return this.timeRepository.updateRestPeriod(
			user,
			restPeriodId,
			request
		);
	}

	public async deleteRestPeriod(restPeriodId: RestPeriodId): Promise<void> {
		const user = await this.userStorage.getUser();
		await this.timeRepository.deleteRestPeriod(user, restPeriodId);
	}
}

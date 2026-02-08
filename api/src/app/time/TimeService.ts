import { Injectable } from '@nestjs/common';
import { Sprint } from '../../domain/time/model/Sprint';
import { SprintSettings } from '../../domain/time/model/SprintSettings';
import { TimeRepository } from './TimeRepository';
import { UserStorage } from '../auth/UserStorage';
import { TimeSprintCalculator } from '../../domain/time/TimeSprintCalculator';

@Injectable()
export class TimeService {
	public constructor(
		private readonly timeRepository: TimeRepository,
		private readonly userStorage: UserStorage
	) {}

	public async getSprints(): Promise<Sprint[]> {
		const timeSprintCalculator = new TimeSprintCalculator();
		const settings = await this.getSprintSettings();

		return timeSprintCalculator.calculateSprints(settings);
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
}

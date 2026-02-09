import { Injectable, NotImplementedException } from '@nestjs/common';
import { Sprint } from '../../domain/time/model/Sprint';
import { SprintSettings } from '../../domain/time/model/SprintSettings';
import { TimeRepository } from './TimeRepository';
import { UserStorage } from '../auth/UserStorage';
import { getSprintsFromSprintRangesAndSettings } from '../../domain/time/getSprintsFromSprintRangesAndSettings';
import { SprintChangeAttemptResult } from './SprintChangeAttemptResult';
import { SprintTimeRange } from '../../domain/time/model/SprintTimeRange';

@Injectable()
export class TimeService {
	public constructor(
		private readonly timeRepository: TimeRepository,
		private readonly userStorage: UserStorage
	) {}

	public async getSprints(): Promise<Sprint[]> {
		const user = await this.userStorage.getUser();
		const sprintRanges =
			await this.timeRepository.getSprintTimeRanges(user);
		const sprintSettings = await this.getSprintSettings();
		const today = new Date();
		return getSprintsFromSprintRangesAndSettings(
			sprintRanges,
			sprintSettings,
			today
		);
	}

	public updateSprintRanges(
		ranges: SprintTimeRange[]
	): Promise<SprintChangeAttemptResult> {
		throw new NotImplementedException();
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

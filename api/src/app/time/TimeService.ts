import { Injectable, NotImplementedException } from '@nestjs/common';
import { Sprint } from '../../domain/time/model/Sprint';
import { SprintSettings } from '../../domain/time/model/SprintSettings';
import { TimeRepository } from './TimeRepository';
import { UserStorage } from '../auth/UserStorage';
import { getSprintsFromSprintRangesAndSettings } from '../../domain/time/getSprintsFromSprintRangesAndSettings';
import {
	SprintChangeAttemptOverlapFailureResult,
	SprintChangeAttemptResult,
	SprintChangeAttemptSuccessResult
} from './SprintChangeAttemptResult';
import { SprintTimeRange } from '../../domain/time/model/SprintTimeRange';
import { getConflictsOnSprintUpdate } from '../../domain/time/getConflictsOnSprintUpdate';

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

	public async updateSprintRanges(
		ranges: SprintTimeRange[]
	): Promise<SprintChangeAttemptResult> {
		const user = await this.userStorage.getUser();
		const sprintSettings = await this.getSprintSettings();
		const today = new Date();
		const currentRanges =
			await this.timeRepository.getSprintTimeRanges(user);
		const conflicts = getConflictsOnSprintUpdate(ranges, currentRanges);
		if (conflicts.size > 0) {
			return new SprintChangeAttemptOverlapFailureResult(
				new Map<Sprint, Sprint[]>(
					[...conflicts.entries()].map(
						([key, value]) =>
							[
								getSprintsFromSprintRangesAndSettings(
									[key],
									sprintSettings,
									today
								)[0],
								getSprintsFromSprintRangesAndSettings(
									value,
									sprintSettings,
									today
								)
							] as const
					)
				)
			);
		}

		await this.timeRepository.updateSprintTimeRanges(user, ranges);
		return new SprintChangeAttemptSuccessResult(
			[],
			getSprintsFromSprintRangesAndSettings(ranges, sprintSettings, today)
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
}

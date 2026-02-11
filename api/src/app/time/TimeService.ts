import { Injectable, NotImplementedException } from '@nestjs/common';
import { Sprint } from '../../domain/time/model/Sprint';
import {
	SprintSettings,
	SprintSettingsDuration
} from '../../domain/time/model/SprintSettings';
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
import { getNewSprintTimeRanges } from '../../domain/time/getNewSprintTimeRanges';
import {
	SprintCreateAttemptOverlapFailureResult,
	SprintCreateAttemptResult,
	SprintCreateAttemptSuccessResult
} from './SprintCreateAttemptResult';
import { getConflictsOnSprintCreate } from '../../domain/time/GetConflictsOnSprintCreate';
import { SprintId } from '../../domain/time/model/SprintId';
import {
	SprintDeleteAttempt,
	SprintDeleteSuccessAttempt
} from './SprintDeleteAttempt';

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
			getSprintsFromSprintRangesAndSettings(ranges, sprintSettings, today)
		);
	}

	public async createBulkSprints(
		startDate: Date,
		numberOfSprints: number,
		sprintDuration: SprintSettingsDuration
	): Promise<SprintCreateAttemptResult> {
		const user = await this.userStorage.getUser();
		const currentRanges =
			await this.timeRepository.getSprintTimeRanges(user);
		const timeRanges = getNewSprintTimeRanges(
			startDate,
			numberOfSprints,
			sprintDuration
		);
		const sprintSettings = await this.getSprintSettings();
		const today = new Date();

		const conflicts = getConflictsOnSprintCreate(timeRanges, currentRanges);
		if (conflicts.length > 0) {
			return new SprintCreateAttemptOverlapFailureResult(
				getSprintsFromSprintRangesAndSettings(
					conflicts,
					sprintSettings,
					today
				)
			);
		}

		const adddedRanges = await this.timeRepository.createSprintTimeRanges(
			user,
			timeRanges
		);

		return new SprintCreateAttemptSuccessResult(
			getSprintsFromSprintRangesAndSettings(
				adddedRanges,
				sprintSettings,
				today
			)
		);
	}

	public async deleteSprintsByIds(
		ids: SprintId[]
	): Promise<SprintDeleteAttempt> {
		// TODO: check if all sprints have no tasks assigned when tasks will be implemented

		const user = await this.userStorage.getUser();
		await this.timeRepository.deleteSprintTimeRanges(user, ids);
		return new SprintDeleteSuccessAttempt();
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

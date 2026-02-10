import { User } from '../../domain/auth/model/User';
import { SprintSettings } from '../../domain/time/model/SprintSettings';
import { SprintTimeRange } from '../../domain/time/model/SprintTimeRange';
import { SprintId } from '../../domain/time/model/SprintId';
import { TimeRange } from '../../domain/time/model/TimeRange';

export abstract class TimeRepository {
	abstract getSprintTimeRanges(user: User): Promise<SprintTimeRange[]>;
	abstract updateSprintTimeRanges(
		user: User,
		ranges: SprintTimeRange[]
	): Promise<void>;
	abstract createSprintTimeRanges(
		user: User,
		ranges: TimeRange[]
	): Promise<SprintTimeRange[]>;
	abstract deleteSprintTimeRange(user: User, id: SprintId): Promise<void>;

	abstract getSprintSettings(user: User): Promise<SprintSettings | null>;

	abstract updateSprintSettings(
		user: User,
		settings: SprintSettings
	): Promise<void>;
}

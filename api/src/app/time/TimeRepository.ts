import { User } from '../../domain/auth/model/User';
import { SprintSettings } from '../../domain/time/model/SprintSettings';

export abstract class TimeRepository {
	abstract getSprintSettings(user: User): Promise<SprintSettings | null>;
	abstract updateSprintSettings(
		user: User,
		settings: SprintSettings
	): Promise<void>;
}

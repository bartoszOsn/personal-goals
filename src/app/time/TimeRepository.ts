import { User } from '../../domain/auth/model/User';
import { SprintSettings } from '../../domain/time/model/SprintSettings';
import { RestPeriod, RestPeriodId } from '../../domain/time/model/RestPeriod';
import { RestPeriodRequest } from 'src/domain/time/model/RestPeriodRequest';

export abstract class TimeRepository {
	abstract getSprintSettings(user: User): Promise<SprintSettings>;
	abstract updateSprintSettings(
		user: User,
		settings: SprintSettings
	): Promise<void>;

	abstract getRestPeriods(user: User): Promise<RestPeriod[]>;

	abstract addRestPeriod(
		user: User,
		request: RestPeriodRequest
	): Promise<RestPeriod>;

	abstract updateRestPeriod(
		user: User,
		restPeriodId: RestPeriodId,
		request: RestPeriodRequest
	): Promise<RestPeriod>;

	abstract deleteRestPeriod(
		user: User,
		restPeriodId: RestPeriodId
	): Promise<void>;
}

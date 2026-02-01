import { Injectable } from '@nestjs/common';
import { TimeRepository } from '../../app/time/TimeRepository';
import { User } from 'src/domain/auth/model/User';
import { RestPeriod, RestPeriodId } from 'src/domain/time/model/RestPeriod';
import { RestPeriodRequest } from 'src/domain/time/model/RestPeriodRequest';
import { SprintSettings } from 'src/domain/time/model/SprintSettings';

@Injectable()
export class TimeRepositoryImpl extends TimeRepository {
	getSprintSettings(user: User): Promise<SprintSettings | null> {
		throw new Error('Method not implemented.');
	}
	updateSprintSettings(user: User, settings: SprintSettings): Promise<void> {
		throw new Error('Method not implemented.');
	}
	getRestPeriods(user: User): Promise<RestPeriod[]> {
		throw new Error('Method not implemented.');
	}
	addRestPeriod(user: User, request: RestPeriodRequest): Promise<RestPeriod> {
		throw new Error('Method not implemented.');
	}
	updateRestPeriod(
		user: User,
		restPeriodId: RestPeriodId,
		request: RestPeriodRequest
	): Promise<RestPeriod> {
		throw new Error('Method not implemented.');
	}
	deleteRestPeriod(user: User, restPeriodId: RestPeriodId): Promise<void> {
		throw new Error('Method not implemented.');
	}
}

import { Injectable } from '@nestjs/common';
import { TimeRepository } from '../../app/time/TimeRepository';
import { User } from 'src/domain/auth/model/User';
import { RestPeriod, RestPeriodId } from 'src/domain/time/model/RestPeriod';
import { RestPeriodRequest } from 'src/domain/time/model/RestPeriodRequest';
import { SprintSettings } from 'src/domain/time/model/SprintSettings';
import { Repository } from 'typeorm';
import { SprintSettingsEntity } from './entity/SprintSettingsEntity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../auth/entity/UserEntity';
import { TimeEntityConverter } from './TimeEntityConverter';
import { RestPeriodEntity } from './entity/RestPeriodEntity';

@Injectable()
export class TimeRepositoryImpl extends TimeRepository {
	constructor(
		@InjectRepository(SprintSettingsEntity)
		private readonly sprintSettingsRepository: Repository<SprintSettingsEntity>,
		@InjectRepository(RestPeriodEntity)
		private readonly restPeriodRepository: Repository<RestPeriodEntity>,
		private readonly timeEntityConverter: TimeEntityConverter
	) {
		super();
	}

	async getSprintSettings(user: User): Promise<SprintSettings | null> {
		const settingsEntity = await this.sprintSettingsRepository.findOneBy({
			user: { id: user.id } as unknown as UserEntity
		});

		if (!settingsEntity) {
			return null;
		}

		return this.timeEntityConverter.fromSprintSettingsEntity(
			settingsEntity
		);
	}

	async updateSprintSettings(
		user: User,
		settings: SprintSettings
	): Promise<void> {
		await this.sprintSettingsRepository.update(
			{
				user: { id: user.id.id } as unknown as UserEntity
			},
			{
				sprintDuration:
					this.timeEntityConverter.toSprintSettingsEntityDuration(
						settings.sprintDuration
					),
				quarterAssignment:
					this.timeEntityConverter.toSprintSettingsEntityQuarterAssignment(
						settings.quarterAssignment
					),
				generateUntil: settings.generateUntil
			}
		);
	}

	async getRestPeriods(user: User): Promise<RestPeriod[]> {
		const entities = await this.restPeriodRepository.findBy({
			user: { id: user.id } as unknown as UserEntity
		});

		return entities.map((entity) =>
			this.timeEntityConverter.fromRestPeriodEntity(entity)
		);
	}

	async addRestPeriod(
		user: User,
		request: RestPeriodRequest
	): Promise<RestPeriod> {
		const entity = this.timeEntityConverter.toRestPeriodEntity(
			user,
			request
		);
		await this.restPeriodRepository.save(entity);
		return this.timeEntityConverter.fromRestPeriodEntity(entity);
	}

	async updateRestPeriod(
		restPeriodId: RestPeriodId,
		request: RestPeriodRequest
	): Promise<RestPeriod> {
		await this.restPeriodRepository.update(
			{
				id: restPeriodId.getId()
			},
			{
				name: request.name ?? undefined,
				start: request.start,
				end: request.end
			}
		);

		const entity = await this.restPeriodRepository.findOneBy({
			id: restPeriodId.getId()
		});

		if (!entity) {
			throw new Error('Rest period not found');
		}

		return this.timeEntityConverter.fromRestPeriodEntity(entity);
	}

	async deleteRestPeriod(
		user: User,
		restPeriodId: RestPeriodId
	): Promise<void> {
		await this.restPeriodRepository.delete({
			user: { id: user.id } as unknown as UserEntity,
			id: restPeriodId.getId()
		});
	}
}

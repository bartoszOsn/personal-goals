import { Injectable } from '@nestjs/common';
import { TimeRepository } from '../../app/time/TimeRepository';
import { User } from 'src/domain/auth/model/User';
import { SprintSettings } from 'src/domain/time/model/SprintSettings';
import { Repository } from 'typeorm';
import { SprintSettingsEntity } from './entity/SprintSettingsEntity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../auth/entity/UserEntity';
import { TimeEntityConverter } from './TimeEntityConverter';
import { SprintId } from 'src/domain/time/model/SprintId';
import { SprintTimeRange } from 'src/domain/time/model/SprintTimeRange';
import { SprintTimeRangeEntity } from './entity/SprintTimeRangeEntity';

@Injectable()
export class TimeRepositoryImpl extends TimeRepository {
	constructor(
		@InjectRepository(SprintTimeRangeEntity)
		private readonly sprintTimeRangeRepository: Repository<SprintTimeRangeEntity>,
		@InjectRepository(SprintSettingsEntity)
		private readonly sprintSettingsRepository: Repository<SprintSettingsEntity>,
		private readonly timeEntityConverter: TimeEntityConverter
	) {
		super();
	}

	async getSprintTimeRanges(user: User): Promise<SprintTimeRange[]> {
		const entities = await this.sprintTimeRangeRepository.findBy({
			user: { id: user.id.id }
		});

		return this.timeEntityConverter.fromSprintTimeRangeEntities(entities);
	}

	async updateSprintTimeRange(
		user: User,
		timeRange: SprintTimeRange
	): Promise<SprintTimeRange> {
		await this.sprintTimeRangeRepository.update(
			{
				user: { id: user.id.id },
				id: timeRange.id.value
			},
			{ startDate: timeRange.startDate, endDate: timeRange.endDate }
		);

		const entity = await this.sprintTimeRangeRepository.findOneBy({
			user: { id: user.id.id },
			id: timeRange.id.value
		});

		if (!entity) {
			throw new Error('Sprint time range not found');
		}

		return this.timeEntityConverter.fromSprintTimeRangeEntity(entity);
	}

	async createSprintTimeRange(
		user: User,
		startDate: Date,
		endDate: Date
	): Promise<SprintTimeRange> {
		const entity = new SprintTimeRangeEntity();
		entity.user = { id: user.id.id } as unknown as UserEntity;
		entity.startDate = startDate;
		entity.endDate = endDate;

		const createdEntity = await this.sprintTimeRangeRepository.save(entity);

		return this.timeEntityConverter.fromSprintTimeRangeEntity(
			createdEntity
		);
	}

	async deleteSprintTimeRange(user: User, id: SprintId): Promise<void> {
		await this.sprintTimeRangeRepository.delete({
			user: { id: user.id.id },
			id: id.value
		});
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
}

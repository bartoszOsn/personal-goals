import { Injectable } from '@nestjs/common';
import { TimeRepository } from '../../app/time/TimeRepository';
import { User } from 'src/domain/auth/model/User';
import { SprintSettings } from 'src/domain/time/model/SprintSettings';
import { In, Repository } from 'typeorm';
import { SprintSettingsEntity } from './entity/SprintSettingsEntity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../auth/entity/UserEntity';
import { TimeEntityConverter } from './TimeEntityConverter';
import { SprintId } from 'src/domain/time/model/SprintId';
import { SprintTimeRange } from 'src/domain/time/model/SprintTimeRange';
import { SprintTimeRangeEntity } from './entity/SprintTimeRangeEntity';
import { TimeRange } from '../../domain/time/model/TimeRange';

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
		const entities = await this.sprintTimeRangeRepository.find({
			where: {
				user: { id: user.id.id }
			},
			order: {
				startDate: 'ASC'
			}
		});

		return this.timeEntityConverter.fromSprintTimeRangeEntities(entities);
	}

	async updateSprintTimeRanges(
		user: User,
		timeRanges: SprintTimeRange[]
	): Promise<void> {
		await this.sprintTimeRangeRepository.manager.transaction(
			async (manager) => {
				for (const timeRange of timeRanges) {
					await manager.update(
						SprintTimeRangeEntity,
						{
							user: { id: user.id.id },
							id: timeRange.id.value
						},
						{
							startDate: timeRange.startDate.toString(),
							endDate: timeRange.endDate.toString()
						}
					);
				}
			}
		);
	}

	async createSprintTimeRanges(
		user: User,
		ranges: TimeRange[]
	): Promise<SprintTimeRange[]> {
		const entities = ranges.map((range) => {
			const entity = new SprintTimeRangeEntity();
			entity.user = { id: user.id.id } as unknown as UserEntity;
			entity.startDate = range.startDate.toString();
			entity.endDate = range.endDate.toString();
			return entity;
		});

		const createdEntities =
			await this.sprintTimeRangeRepository.save(entities);

		return this.timeEntityConverter.fromSprintTimeRangeEntities(
			createdEntities
		);
	}

	async deleteSprintTimeRanges(user: User, ids: SprintId[]): Promise<void> {
		await this.sprintTimeRangeRepository.delete({
			user: { id: user.id.id },
			id: In(ids.map((id) => id.value))
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
				generateUntil: settings.generateUntil.toString()
			}
		);
	}
}

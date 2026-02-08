import { Injectable } from '@nestjs/common';
import { TimeRepository } from '../../app/time/TimeRepository';
import { User } from 'src/domain/auth/model/User';
import { SprintSettings } from 'src/domain/time/model/SprintSettings';
import { Repository } from 'typeorm';
import { SprintSettingsEntity } from './entity/SprintSettingsEntity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../auth/entity/UserEntity';
import { TimeEntityConverter } from './TimeEntityConverter';

@Injectable()
export class TimeRepositoryImpl extends TimeRepository {
	constructor(
		@InjectRepository(SprintSettingsEntity)
		private readonly sprintSettingsRepository: Repository<SprintSettingsEntity>,
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
}

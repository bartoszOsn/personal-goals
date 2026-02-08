import { Body, Controller, Get, Put } from '@nestjs/common';
import { TimeService } from '../../app/time/TimeService';
import { TimeDTOConverter } from './TimeDTOConverter';
import type { SprintListDTO, SprintSettingsDTO } from '@personal-okr/shared';

@Controller('time')
export class TimeController {
	constructor(
		private readonly timeService: TimeService,
		private readonly timeDTOConverter: TimeDTOConverter
	) {}

	@Get('sprint')
	public async getSprints(): Promise<SprintListDTO> {
		const sprints = await this.timeService.getSprints();
		return this.timeDTOConverter.toListDTO(sprints);
	}

	@Get('sprint-settings')
	public async getSprintsSettings(): Promise<SprintSettingsDTO> {
		const settings = await this.timeService.getSprintSettings();
		return this.timeDTOConverter.toSettingsDTO(settings);
	}

	@Put('sprint-settings')
	public async updateSprintsSettings(
		@Body() settings: SprintSettingsDTO
	): Promise<void> {
		const request = this.timeDTOConverter.fromSettingsDTO(settings);
		await this.timeService.updateSprintSettings(request);
	}
}

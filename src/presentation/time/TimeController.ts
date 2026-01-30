import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import type { SprintSettingsDTO } from './dto/SprintSettingsDTO';
import type { RestPeriodListDTO } from './dto/RestPeriodListDTO';
import type { RestPeriodRequestDTO } from './dto/RestPeriodRequestDTO';
import type { RestPeriodDTO } from './dto/RestPeriodDTO';
import { SprintListDTO } from './dto/SprintListDTO';
import { TimeService } from '../../app/time/TimeService';
import { TimeDTOConverter } from './TimeDTOConverter';
import { RestPeriodId } from '../../domain/time/model/RestPeriod';

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
		settings: SprintSettingsDTO
	): Promise<void> {
		const request = this.timeDTOConverter.fromSettingsDTO(settings);
		await this.timeService.updateSprintSettings(request);
	}

	@Get('rest-period')
	public async getRestPeriods(): Promise<RestPeriodListDTO> {
		const restPeriods = await this.timeService.getRestPeriods();

		return this.timeDTOConverter.toRestPeriodListDTO(restPeriods);
	}

	@Post('rest-period')
	public async addRestPeriod(
		restPeriodCreation: RestPeriodRequestDTO
	): Promise<RestPeriodDTO> {
		const request =
			this.timeDTOConverter.fromRestPeriodRequestDTO(restPeriodCreation);

		const newRestPeriod = await this.timeService.addRestPeriod(request);
		return this.timeDTOConverter.toRestPeriodDTO(newRestPeriod);
	}

	@Put('rest-period/:id')
	public async updateRestPeriod(
		restPeriodRequest: RestPeriodRequestDTO,
		@Param('id') id: string
	): Promise<RestPeriodDTO> {
		const request =
			this.timeDTOConverter.fromRestPeriodRequestDTO(restPeriodRequest);
		const restPeriodId = new RestPeriodId(id);

		const updated = await this.timeService.updateRestPeriod(
			restPeriodId,
			request
		);
		return this.timeDTOConverter.toRestPeriodDTO(updated);
	}

	@Delete('rest-period/:id')
	public async deleteRestPeriod(
		@Param('id')
		id: string
	): Promise<void> {
		const restPeriodId = new RestPeriodId(id);
		await this.timeService.deleteRestPeriod(restPeriodId);
	}
}

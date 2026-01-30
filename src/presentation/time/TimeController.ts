import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import type { SprintSettingsDTO } from './dto/SprintSettingsDTO';
import type { RestPeriodListDTO } from './dto/RestPeriodListDTO';
import type { RestPeriodRequestDTO } from './dto/RestPeriodRequestDTO';
import type { RestPeriodDTO } from './dto/RestPeriodDTO';
import { SprintListDTO } from './dto/SprintListDTO';

@Controller('time')
export class TimeController {
	@Get('sprint')
	public getSprints(): Promise<SprintListDTO> {
		return Promise.resolve({
			sprints: []
		});
	}

	@Get('sprint-settings')
	public getSprintsSettings(): Promise<SprintSettingsDTO> {
		return Promise.resolve({
			sprintDuration: 'two-weeks',
			quarterAssignment: 'beginning'
		});
	}

	@Put('sprint-settings')
	public updateSprintsSettings(settings: SprintSettingsDTO): Promise<void> {
		return Promise.resolve();
	}

	@Get('rest-period')
	public getRestPeriods(): Promise<RestPeriodListDTO> {
		return Promise.resolve({
			restPeriods: []
		});
	}

	@Post('rest-period')
	public addRestPeriod(
		restPeriodCreation: RestPeriodRequestDTO
	): Promise<RestPeriodDTO> {
		return Promise.resolve({
			...restPeriodCreation,
			id: 'asd'
		});
	}

	@Put('rest-period/:id')
	public updateRestPeriod(
		restPeriodRequest: RestPeriodRequestDTO,
		@Param('id') id: string
	): Promise<RestPeriodDTO> {
		return Promise.resolve({
			...restPeriodRequest,
			id: id
		});
	}

	@Delete('rest-period/:id')
	public deleteRestPeriod(
		@Param('id')
		id: string
	): Promise<void> {
		return Promise.resolve();
	}
}

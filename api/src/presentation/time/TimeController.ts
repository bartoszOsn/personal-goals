import {
	Body,
	ConflictException,
	Controller,
	Delete,
	Get,
	NotImplementedException,
	Param,
	ParseArrayPipe,
	Post,
	Put
} from '@nestjs/common';
import { TimeService } from '../../app/time/TimeService';
import { TimeDTOConverter } from './TimeDTOConverter';
import type {
	SprintListDTO,
	SprintSettingsDTO,
	SprintListChangeDTO,
	SprintDeleteResultDTO,
	SprintChangeRequestDTO,
	SprintBulkCreateRequestDTO,
	SprintListCreateDTO
} from '@personal-okr/shared';
import { SprintId } from '../../domain/time/model/SprintId';

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

	@Post('sprint')
	public async createSprints(
		@Body() request: SprintBulkCreateRequestDTO
	): Promise<SprintListCreateDTO> {
		const sprintDuration = this.timeDTOConverter.fromSprintDurationDTO(
			request.sprintDuration
		);
		const result = await this.timeService.createBulkSprints(
			new Date(request.startDate),
			request.numberOfSprints,
			sprintDuration
		);

		if (result.isSuccess) {
			return this.timeDTOConverter.toListCreateDTO(result);
		} else {
			throw new ConflictException(
				this.timeDTOConverter.toListCreateDTO(result)
			);
		}
	}

	@Put('sprint')
	public async updateSprints(
		@Body() request: SprintChangeRequestDTO
	): Promise<SprintListChangeDTO> {
		const newRanges =
			this.timeDTOConverter.fromSprintChangeRequestDTO(request);
		const result = await this.timeService.updateSprintRanges(newRanges);
		if (result.isSuccess) {
			return this.timeDTOConverter.toListChangeDTO(result);
		} else {
			throw new ConflictException(
				this.timeDTOConverter.toListChangeDTO(result)
			);
		}
	}

	@Delete('sprint/:ids')
	public async deleteSprint(
		@Param('ids', new ParseArrayPipe({ items: String, separator: ',' }))
		ids: string[]
	): Promise<SprintDeleteResultDTO> {
		const sprintIds = ids.map((id) => new SprintId(id));
		const result = await this.timeService.deleteSprintsByIds(sprintIds);
		if (result.isSuccess) {
			return this.timeDTOConverter.toSprintDeleteResultDTO(result);
		} else {
			throw new ConflictException(
				this.timeDTOConverter.toSprintDeleteResultDTO(result)
			);
		}
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

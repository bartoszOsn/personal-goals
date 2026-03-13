import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseArrayPipe,
	ParseIntPipe,
	Post,
	Put
} from '@nestjs/common';
import { SprintDTO, SprintsUpdateRequestDTO } from '@personal-okr/shared';
import { ContextYear } from '../../domain/common/model/ContextYear';
import { SprintId } from '../../domain/sprint/model/SprintId';
import { SprintService } from '../../app/sprint/SprintService';
import { SprintDTOConverter } from './SprintDTOConverter';

@Controller('sprint')
export class SprintController {
	constructor(
		private readonly sprintService: SprintService,
		private readonly sprintDTOConverter: SprintDTOConverter
	) {}

	@Get(':context')
	async getSprintsByContext(
		@Param('context', new ParseIntPipe()) contextRaw: number
	): Promise<SprintDTO[]> {
		const context = new ContextYear(contextRaw);
		const sprintCollection =
			await this.sprintService.getSprintsByContext(context);

		return this.sprintDTOConverter.toSprintsDTO(sprintCollection);
	}

	@Post(':context')
	async createSprint(
		@Param('context', new ParseIntPipe()) contextRaw: number
	): Promise<SprintDTO[]> {
		const context = new ContextYear(contextRaw);
		const sprintCollection = await this.sprintService.createSprint(context);
		return this.sprintDTOConverter.toSprintsDTO(sprintCollection);
	}

	@Post(':context/fill')
	async fillSprints(
		@Param('context', new ParseIntPipe()) contextRaw: number
	): Promise<SprintDTO[]> {
		const context = new ContextYear(contextRaw);
		const sprintCollection = await this.sprintService.fillSprints(context);
		return this.sprintDTOConverter.toSprintsDTO(sprintCollection);
	}

	@Put(':context')
	async updateSprints(
		@Param('context', new ParseIntPipe()) contextRaw: number,
		@Body() body: SprintsUpdateRequestDTO
	): Promise<SprintDTO[]> {
		const context = new ContextYear(contextRaw);
		const requests =
			this.sprintDTOConverter.fromSprintsUpdateRequestDTO(body);
		const sprintCollection = await this.sprintService.updateSprints(
			context,
			requests
		);
		return this.sprintDTOConverter.toSprintsDTO(sprintCollection);
	}

	@Delete(':context/:ids')
	async deleteSprints(
		@Param('context', new ParseIntPipe()) contextRaw: number,
		@Param('ids', new ParseArrayPipe({ separator: ',' })) idsRaw: string[]
	): Promise<SprintDTO[]> {
		const context = new ContextYear(contextRaw);
		const ids = idsRaw.map((id) => new SprintId(id));
		const sprintCollection = await this.sprintService.deleteSprints(
			context,
			ids
		);
		return this.sprintDTOConverter.toSprintsDTO(sprintCollection);
	}
}

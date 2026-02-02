import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put
} from '@nestjs/common';
import { ObjectiveDTO } from './dto/ObjectiveDTO';
import { KeyResultDTO } from './dto/KeyResultDTO';
import type { ObjectiveRequestDTO } from './dto/ObjectiveRequestDTO';
import type { KeyResultRequestDTO } from './dto/KeyResultRequestDTO';
import { WorkOKRService } from '../../app/work/WorkOKRService';
import { ObjectiveListDTO } from './dto/ObjectiveListDTO';
import { WorkOkrDTOConverter } from './WorkOkrDTOConverter';
import { ObjectiveId } from '../../domain/work/model/Objective';
import { KeyResultId } from '../../domain/work/model/KeyResult';

@Controller('work/okr')
export class WorkPresentationOKRController {
	constructor(
		private readonly workOKRService: WorkOKRService,
		private readonly workOkrDTOConverter: WorkOkrDTOConverter
	) {}

	@Get('objective')
	async getOKRs(): Promise<ObjectiveListDTO> {
		const objectives = await this.workOKRService.getObjectives();
		return this.workOkrDTOConverter.toObjectiveListDTO(objectives);
	}

	@Post('objective')
	async createObjective(
		@Body() request: ObjectiveRequestDTO
	): Promise<ObjectiveDTO> {
		const domainRequest =
			this.workOkrDTOConverter.fromObjectiveRequestDTO(request);
		const objective =
			await this.workOKRService.createObjective(domainRequest);
		return this.workOkrDTOConverter.toObjectiveDTO(objective);
	}

	@Put('objective/:objectiveId')
	async updateObjective(
		@Param('objectiveId') objectiveId: string,
		@Body() request: ObjectiveRequestDTO
	): Promise<ObjectiveDTO> {
		const domainRequest =
			this.workOkrDTOConverter.fromObjectiveRequestDTO(request);
		const id = new ObjectiveId(objectiveId);
		const objective = await this.workOKRService.updateObjective(
			id,
			domainRequest
		);
		return this.workOkrDTOConverter.toObjectiveDTO(objective);
	}

	@Delete('objective/:objectiveId')
	async deleteObjective(
		@Param('objectiveId') objectiveId: string
	): Promise<void> {
		const id = new ObjectiveId(objectiveId);
		await this.workOKRService.deleteObjective(id);
	}

	@Post('/key-result/:objectiveId')
	async createKeyResult(
		@Param('objectiveId') objectiveId: string,
		@Body() request: KeyResultRequestDTO
	): Promise<KeyResultDTO> {
		const id = new ObjectiveId(objectiveId);
		const domainRequest =
			this.workOkrDTOConverter.fromKeyResultRequestDTO(request);
		const keyResult = await this.workOKRService.createKeyResult(
			id,
			domainRequest
		);
		return this.workOkrDTOConverter.toKeyResultDTO(keyResult);
	}

	@Put('key-result/:keyResultId')
	async updateKeyResult(
		@Param('keyResultId') keyResultId: string,
		@Body() request: KeyResultRequestDTO
	): Promise<KeyResultDTO> {
		const id = new KeyResultId(keyResultId);
		const domainRequest =
			this.workOkrDTOConverter.fromKeyResultRequestDTO(request);
		const keyResult = await this.workOKRService.updateKeyResult(
			id,
			domainRequest
		);
		return this.workOkrDTOConverter.toKeyResultDTO(keyResult);
	}

	@Delete('key-result/:keyResultId')
	async deleteKeyResult(
		@Param('keyResultId') keyResultId: string
	): Promise<void> {
		const id = new KeyResultId(keyResultId);
		await this.workOKRService.deleteKeyResult(id);
	}
}

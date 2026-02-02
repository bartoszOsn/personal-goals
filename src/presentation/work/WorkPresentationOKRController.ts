import {
	Body,
	Controller,
	Delete,
	Get,
	NotImplementedException,
	Param,
	Post,
	Put
} from '@nestjs/common';
import { ObjectiveDTO } from './dto/ObjectiveDTO';
import { KeyResultDTO } from './dto/KeyResultDTO';
import type { ObjectiveRequestDTO } from './dto/ObjectiveRequestDTO';
import type { KeyResultRequestDTO } from './dto/KeyResultRequestDTO';

@Controller('work/okr')
export class WorkPresentationOKRController {
	@Get('objective')
	async getOKRs(): Promise<ObjectiveDTO[]> {
		throw new NotImplementedException();
	}

	@Post('objective')
	async createObjective(
		@Body() request: ObjectiveRequestDTO
	): Promise<ObjectiveDTO> {
		throw new NotImplementedException();
	}

	@Put('objective/:objectiveId')
	async updateObjective(
		@Param('objectiveId') objectiveId: string,
		@Body() request: ObjectiveRequestDTO
	): Promise<ObjectiveDTO> {
		throw new NotImplementedException();
	}

	@Delete('objective/:objectiveId')
	async deleteObjective(
		@Param('objectiveId') objectiveId: string
	): Promise<void> {
		throw new NotImplementedException();
	}

	@Post('key-result')
	async createKeyResult(
		@Body() request: KeyResultRequestDTO
	): Promise<KeyResultDTO> {
		throw new NotImplementedException();
	}

	@Put('key-result/:keyResultId')
	async updateKeyResult(
		@Param('keyResultId') keyResultId: string,
		@Body() request: KeyResultRequestDTO
	): Promise<KeyResultDTO> {
		throw new NotImplementedException();
	}

	@Delete('key-result/:keyResultId')
	async deleteKeyResult(
		@Param('keyResultId') keyResultId: string
	): Promise<void> {
		throw new NotImplementedException();
	}
}

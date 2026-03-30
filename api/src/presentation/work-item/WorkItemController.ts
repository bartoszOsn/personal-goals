import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseArrayPipe,
	ParseIntPipe,
	Post,
	Put,
	UseFilters
} from '@nestjs/common';
import { WorkItemFacade } from '../../app/work-item/WorkItemFacade';
import {
	WorkItemCreationRequestDTOOld,
	WorkItemDTOOld,
	WorkItemUpdateRequestDTOOld
} from '@personal-okr/shared';
import { WorkItemDTOConverter } from './WorkItemDTOConverter';
import { ContextYear } from '../../domain/common/model/ContextYear';
import { WorkItemId } from '../../domain/work-item/model/WorkItemId';
import { WorkItemDomainErrorExceptionFilter } from './WorkItemDomainErrorExceptionFilter';

@Controller('work-item')
@UseFilters(WorkItemDomainErrorExceptionFilter)
export class WorkItemController {
	constructor(
		private readonly workItemFacade: WorkItemFacade,
		private readonly workItemDTOConverter: WorkItemDTOConverter
	) {}

	@Get('/:context')
	public async getWorkItemsByContext(
		@Param('context', new ParseIntPipe()) contextRaw: number
	): Promise<WorkItemDTOOld[]> {
		const context = new ContextYear(contextRaw);
		const workItems =
			await this.workItemFacade.getWorkItemsByContext(context);
		return this.workItemDTOConverter.toWorkItemsDTO(workItems);
	}

	@Get('/details/:id')
	public async getWorkItemById(
		@Param('id') idRaw: string
	): Promise<WorkItemDTOOld> {
		const id = new WorkItemId(idRaw);
		const workItem = await this.workItemFacade.getWorkItemById(id);
		return this.workItemDTOConverter.toWorkItemDTO(workItem);
	}

	@Post()
	public async createWorkItem(
		@Body() request: WorkItemCreationRequestDTOOld
	): Promise<WorkItemDTOOld> {
		const context = new ContextYear(request.context);
		const type = this.workItemDTOConverter.fromWorkItemTypeDTO(
			request.type
		);
		const parent = request.parentId
			? new WorkItemId(request.parentId)
			: undefined;

		let workItem = await this.workItemFacade.createWorkItem(
			context,
			type,
			parent
		);

		const updateRequest = request.fields
			? await this.workItemDTOConverter.fromWorkItemUpdateRequestDTO(
					workItem.id,
					request.fields
				)
			: undefined;

		if (updateRequest) {
			workItem = await this.workItemFacade.updateWorkItem(updateRequest);
		}

		return this.workItemDTOConverter.toWorkItemDTO(workItem);
	}

	@Put('/:id')
	public async updateWorkItem(
		@Param('id') idRaw: string,
		@Body() requestRaw: WorkItemUpdateRequestDTOOld
	): Promise<WorkItemDTOOld> {
		const id = new WorkItemId(idRaw);
		const request =
			await this.workItemDTOConverter.fromWorkItemUpdateRequestDTO(
				id,
				requestRaw
			);
		const workItem = await this.workItemFacade.updateWorkItem(request);
		return this.workItemDTOConverter.toWorkItemDTO(workItem);
	}

	@Delete('/:ids')
	public async deleteWorkItems(
		@Param('ids', new ParseArrayPipe({ separator: ',' })) idsRaw: string[]
	): Promise<void> {
		const ids = idsRaw.map((id) => new WorkItemId(id));
		await this.workItemFacade.deleteWorkItems(ids);
	}
}

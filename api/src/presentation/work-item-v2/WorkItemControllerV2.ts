import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	ParseArrayPipe,
	ParseIntPipe,
	Post,
	Put,
	UseFilters
} from '@nestjs/common';
import {
	WorkItemDTO,
	WorkItemHierarchyCreateRequestDTO,
	WorkItemHierarchyDTO,
	WorkItemHierarchyMoveRequestDTO,
	WorkItemSprintOverviewDTO,
	WorkItemSprintOverviewMoveRequestDTO,
	WorkItemStatusDTO,
	WorkItemsUpdateRequestDTO
} from '@personal-okr/shared';
import { WorkItemService } from '../../app/work-item-v2/WorkItemService';
import { ContextYear } from '../../domain/common/model/ContextYear';
import { WorkItemDTOConverter } from './WorkItemDTOConverter';
import { WorkItemId } from '../../domain/work-item-v2/model/WorkItemId';
import { SprintId } from '../../domain/sprint/model/SprintId';
import { SprintService } from '../../app/sprint/SprintService';
import { WorkItemDomainErrorExceptionFilter } from './WorkItemDomainErrorExceptionFilter';

@Controller('work-item')
@UseFilters(WorkItemDomainErrorExceptionFilter)
export class WorkItemControllerV2 {
	constructor(
		private readonly workItemService: WorkItemService,
		private readonly workItemDTOConverter: WorkItemDTOConverter,
		private readonly sprintService: SprintService
	) {}

	@Get('hierarchy/:context')
	async getHierarchy(
		@Param('context', ParseIntPipe) contextRaw: number
	): Promise<WorkItemHierarchyDTO> {
		const context = new ContextYear(contextRaw);
		const hierarchy =
			await this.workItemService.getHierarchyForContext(context);
		return this.workItemDTOConverter.toWorkItemHierarchyDTO(hierarchy);
	}

	@Post('hierarchy/:context')
	async createInHierarchy(
		@Param('context', ParseIntPipe) contextRaw: number,
		@Body() request: WorkItemHierarchyCreateRequestDTO
	): Promise<WorkItemHierarchyDTO> {
		const context = new ContextYear(contextRaw);
		const type = this.workItemDTOConverter.toWorkItemType(request.type);
		const parentId = request.parentId
			? new WorkItemId(request.parentId)
			: undefined;
		const hierarchy = await this.workItemService.createInHierarchy(
			context,
			type,
			parentId
		);
		return this.workItemDTOConverter.toWorkItemHierarchyDTO(hierarchy);
	}

	@Put('hierarchy/:context')
	async updateInHierarchy(
		@Param('context', ParseIntPipe) contextRaw: number,
		@Body() request: WorkItemsUpdateRequestDTO
	): Promise<WorkItemHierarchyDTO> {
		const context = new ContextYear(contextRaw);
		const domainRequest =
			await this.workItemDTOConverter.toWorkItemsUpdateRequest(request);

		const hierarchy = await this.workItemService.updateInHierarchy(
			context,
			domainRequest
		);
		return this.workItemDTOConverter.toWorkItemHierarchyDTO(hierarchy);
	}

	@Put('hierarchy/:context/move')
	async moveInHierarchy(
		@Param('context', ParseIntPipe) contextRaw: number,
		@Body() request: WorkItemHierarchyMoveRequestDTO
	): Promise<WorkItemHierarchyDTO> {
		const context = new ContextYear(contextRaw);
		const domainRequest =
			this.workItemDTOConverter.toWorkItemHierarchyMoveRequest(request);

		const hierarchy = await this.workItemService.moveInHierarchy(
			context,
			domainRequest
		);
		return this.workItemDTOConverter.toWorkItemHierarchyDTO(hierarchy);
	}

	@Delete('hierarchy/:context/:ids')
	async deleteInHierarchy(
		@Param('context', ParseIntPipe) contextRaw: number,
		@Param('ids', new ParseArrayPipe({ separator: ',' }))
		idsRaw: Array<string>
	): Promise<WorkItemHierarchyDTO> {
		const context = new ContextYear(contextRaw);
		const ids = idsRaw.map((id) => new WorkItemId(id));

		const hierarchy = await this.workItemService.deleteInHierarchy(
			context,
			ids
		);
		return this.workItemDTOConverter.toWorkItemHierarchyDTO(hierarchy);
	}

	@Get('sprint-overview/:sprintId')
	async getSprintOverview(
		@Param('sprintId') sprintIdRaw: string
	): Promise<WorkItemSprintOverviewDTO> {
		const sprintId = new SprintId(sprintIdRaw);
		const sprint = await this.sprintService.getSprintById(sprintId);
		if (!sprint) {
			throw new NotFoundException('Sprint not found');
		}

		const sprintOverview =
			await this.workItemService.getSprintOverview(sprint);
		return this.workItemDTOConverter.toWorkItemSprintOverviewDTO(
			sprintOverview
		);
	}

	@Post('sprint-overview/:sprintId/:status')
	async createInSprintOverview(
		@Param('sprintId') sprintIdRaw: string,
		@Param('status') statusRaw: WorkItemStatusDTO
	): Promise<WorkItemSprintOverviewDTO> {
		const sprintId = new SprintId(sprintIdRaw);
		const sprint = await this.sprintService.getSprintById(sprintId);
		if (!sprint) {
			throw new NotFoundException('Sprint not found');
		}
		const status = this.workItemDTOConverter.toWorkItemStatus(statusRaw);

		const sprintOverview =
			await this.workItemService.createInSprintOverview(sprint, status);
		return this.workItemDTOConverter.toWorkItemSprintOverviewDTO(
			sprintOverview
		);
	}

	@Put('sprint-overview/:sprintId/move')
	async moveInSprintOverview(
		@Param('sprintId') sprintIdRaw: string,
		@Body() request: WorkItemSprintOverviewMoveRequestDTO
	): Promise<WorkItemSprintOverviewDTO> {
		const sprintId = new SprintId(sprintIdRaw);
		const sprint = await this.sprintService.getSprintById(sprintId);
		if (!sprint) {
			throw new NotFoundException('Sprint not found');
		}

		const domainRequest =
			this.workItemDTOConverter.toSprintOverviewMoveRequest(request);

		const sprintOverview = await this.workItemService.moveInSprintOverview(
			sprint,
			domainRequest
		);
		return this.workItemDTOConverter.toWorkItemSprintOverviewDTO(
			sprintOverview
		);
	}

	@Get('details/:id')
	async getWorkItemDetails(@Param('id') idRaw: string): Promise<WorkItemDTO> {
		const id = new WorkItemId(idRaw);

		const workItem = await this.workItemService.getWorkItemDetails(id);
		return this.workItemDTOConverter.toWorkItemDTO(workItem.workItem);
	}
}

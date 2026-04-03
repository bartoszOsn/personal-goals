import { z } from 'zod';
import { WorkItemIdDTOSchema } from './WorkItemIdDTO.js';
import { WorkItemMoveOrderDTOSchema } from './WorkItemMoveOrderDTO.js';
import { WorkItemStatusDTOSchema } from './WorkItemStatusDTO.js';

export const WorkItemSprintOverviewMoveRequestDTOSchema = z.object({
	id: WorkItemIdDTOSchema,
	status: WorkItemStatusDTOSchema,
	order: WorkItemMoveOrderDTOSchema
});

export type WorkItemSprintOverviewMoveRequestDTO = z.infer<typeof WorkItemSprintOverviewMoveRequestDTOSchema>;
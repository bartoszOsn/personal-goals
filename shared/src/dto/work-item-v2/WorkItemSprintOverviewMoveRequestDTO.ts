import { z } from 'zod';
import { WorkItemIdDTOSchema } from './WorkItemIdDTO.js';
import { WorkItemMoveOrderDTOSchema } from './WorkItemMoveOrderDTO.js';

export const WorkItemSprintOverviewMoveRequestDTOSchema = z.object({
	id: WorkItemIdDTOSchema,
	order: WorkItemMoveOrderDTOSchema
});

export type WorkItemSprintOverviewMoveRequestDTO = z.infer<typeof WorkItemSprintOverviewMoveRequestDTOSchema>;
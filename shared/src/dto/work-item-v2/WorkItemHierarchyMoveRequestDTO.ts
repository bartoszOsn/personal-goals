import { z } from 'zod';
import { WorkItemIdDTOSchema } from './WorkItemIdDTO.js';
import { WorkItemMoveOrderDTOSchema } from './WorkItemMoveOrderDTO.js';

export const WorkItemHierarchyMoveRequestDTOSchema = z.object({
	id: WorkItemIdDTOSchema,
	parentId: z.union([WorkItemIdDTOSchema, z.null()]),
	order: WorkItemMoveOrderDTOSchema
});

export type WorkItemHierarchyMoveRequestDTO = z.infer<typeof WorkItemHierarchyMoveRequestDTOSchema>;
import { z } from 'zod';
import { WorkItemTypeDTOSchema } from './WorkItemTypeDTO.js';
import { WorkItemIdDTOSchema } from './WorkItemIdDTO.js';

export const WorkItemHierarchyCreateRequestDTOSchema = z.object({
	type: WorkItemTypeDTOSchema,
	parentId: WorkItemIdDTOSchema.optional(),
});

export type WorkItemHierarchyCreateRequestDTO = z.infer<typeof WorkItemHierarchyCreateRequestDTOSchema>;
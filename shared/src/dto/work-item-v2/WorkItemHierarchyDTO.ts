import { z } from 'zod';
import { WorkItemDTOSchema } from './WorkItemDTO.js';

export const WorkItemHierarchyDTOSchema = z.object({
	context: z.int(),
	roots: z.array(WorkItemDTOSchema)
});

export type WorkItemHierarchyDTO = z.infer<typeof WorkItemHierarchyDTOSchema>;

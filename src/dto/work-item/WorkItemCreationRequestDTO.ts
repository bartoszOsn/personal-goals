import { WorkItemTypeDTOSchema } from './WorkItemTypeDTO.js';
import { WorkItemUpdateRequestDTOSchema } from './WorkItemUpdateRequestDTO.js';
import { z } from 'zod';
import { WorkItemIdDTOSchema } from './WorkItemIdDTO.js';

export const WorkItemCreationRequestDTOSchema = z.object({
	context: z.int(),
	type: WorkItemTypeDTOSchema,
	parentId: WorkItemIdDTOSchema.optional(),
	fields: WorkItemUpdateRequestDTOSchema.optional()
});

export type WorkItemCreationRequestDTO = z.infer<typeof WorkItemCreationRequestDTOSchema>;
import { WorkItemTypeDTOSchemaOld } from './WorkItemTypeDTOOld.js';
import { WorkItemUpdateRequestDTOSchemaOld } from './WorkItemUpdateRequestDTOOld.js';
import { z } from 'zod';
import { WorkItemIdDTOSchemaOld } from './WorkItemIdDTOOld.js';

export const WorkItemCreationRequestDTOSchemaOld = z.object({
	context: z.int(),
	type: WorkItemTypeDTOSchemaOld,
	parentId: WorkItemIdDTOSchemaOld.optional(),
	fields: WorkItemUpdateRequestDTOSchemaOld.optional()
});

export type WorkItemCreationRequestDTOOld = z.infer<typeof WorkItemCreationRequestDTOSchemaOld>;
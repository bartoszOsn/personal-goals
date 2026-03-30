import { WorkItemTypeDTOSchemaOld } from './WorkItemTypeDTOOld.js';
import { WorkItemStatusDTOSchemaOld } from './WorkItemStatusDTOOld.js';
import { WorkItemTimeFrameDTOSchemaOld } from './WorkItemTimeFrameDTOOld.js';
import { z } from 'zod';

export const WorkItemUpdateRequestDTOSchemaOld = z.object({
	contextYear: z.int().optional(),
	type: WorkItemTypeDTOSchemaOld.optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	timeFrame: z.union([
		z.object({ empty: z.literal(true) }),
		z.object({ value: WorkItemTimeFrameDTOSchemaOld })
	]).optional(),
	status: WorkItemStatusDTOSchemaOld.optional(),
	progress: z.number().optional()
})

export type WorkItemUpdateRequestDTOOld = z.infer<typeof WorkItemUpdateRequestDTOSchemaOld>;
import { WorkItemTypeDTOSchemaOld } from './WorkItemTypeDTOOld.js';
import { WorkItemStatusDTOSchemaOld } from './WorkItemStatusDTOOld.js';
import { WorkItemProgressDTOSchemaOld } from './WorkItemProgressDTOOld.js';
import { WorkItemTimeFrameDTOSchemaOld } from './WorkItemTimeFrameDTOOld.js';
import { z } from 'zod';
import { WorkItemIdDTOSchemaOld } from './WorkItemIdDTOOld.js';

export const WorkItemDTOSchemaOld = z.object({
	id: WorkItemIdDTOSchemaOld,
	type: WorkItemTypeDTOSchemaOld,
	contextYear: z.int(),
	title: z.string(),
	description: z.string(),
	timeFrame: WorkItemTimeFrameDTOSchemaOld.optional(),
	status: WorkItemStatusDTOSchemaOld,
	progress: WorkItemProgressDTOSchemaOld,
	get children(): z.ZodArray<typeof WorkItemDTOSchemaOld> { return z.array(WorkItemDTOSchemaOld); }
});

export type WorkItemDTOOld = z.infer<typeof WorkItemDTOSchemaOld>;
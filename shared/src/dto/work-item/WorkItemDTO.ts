import { WorkItemTypeDTOSchema } from './WorkItemTypeDTO.js';
import { WorkItemStatusDTOSchema } from './WorkItemStatusDTO.js';
import { WorkItemProgressDTOSchema } from './WorkItemProgressDTO.js';
import { WorkItemTimeFrameDTOSchema } from './WorkItemTimeFrameDTO.js';
import { z } from 'zod';
import { WorkItemIdDTOSchema } from './WorkItemIdDTO.js';

export const WorkItemDTOSchema = z.object({
	id: WorkItemIdDTOSchema,
	type: WorkItemTypeDTOSchema,
	contextYear: z.int(),
	title: z.string(),
	description: z.string(),
	timeFrame: WorkItemTimeFrameDTOSchema.optional(),
	status: WorkItemStatusDTOSchema,
	progress: WorkItemProgressDTOSchema,
	get children(): z.ZodArray<typeof WorkItemDTOSchema> { return z.array(WorkItemDTOSchema); }
});

export type WorkItemDTO = z.infer<typeof WorkItemDTOSchema>;
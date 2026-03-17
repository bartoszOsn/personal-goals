import { WorkItemTypeDTOSchema } from './WorkItemTypeDTO.js';
import { WorkItemStatusDTOSchema } from './WorkItemStatusDTO.js';
import { WorkItemTimeFrameDTOSchema } from './WorkItemTimeFrameDTO.js';
import { z } from 'zod';

export const WorkItemUpdateRequestDTOSchema = z.object({
	contextYear: z.int().optional(),
	type: WorkItemTypeDTOSchema.optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	timeFrame: z.union([
		z.object({ empty: z.literal(true) }),
		z.object({ value: WorkItemTimeFrameDTOSchema })
	]).optional(),
	status: WorkItemStatusDTOSchema.optional(),
	progress: z.number().optional()
})

export type WorkItemUpdateRequestDTO = z.infer<typeof WorkItemUpdateRequestDTOSchema>;
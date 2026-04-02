import { z } from 'zod';
import { WorkItemIdDTOSchema } from './WorkItemIdDTO.js';
import { WorkItemTimeFrameDTOSchema } from './WorkItemTimeFrameDTO.js';
import { WorkItemStatusDTOSchema } from './WorkItemStatusDTO.js';

export const WorkItemUpdateRequestDTOSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	timeFrame: WorkItemTimeFrameDTOSchema.optional(),
	status: WorkItemStatusDTOSchema.optional()
});

export const WorkItemsUpdateRequestDTOSchema = z.object({
	updates: z.record(WorkItemIdDTOSchema, WorkItemUpdateRequestDTOSchema)
});

export type WorkItemsUpdateRequestDTO = z.infer<typeof WorkItemsUpdateRequestDTOSchema>;
export type WorkItemUpdateRequestDTO = z.infer<typeof WorkItemUpdateRequestDTOSchema>;

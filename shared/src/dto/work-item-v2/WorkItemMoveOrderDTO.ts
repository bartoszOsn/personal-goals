import { z } from 'zod';
import { WorkItemIdDTOSchema } from './WorkItemIdDTO.js';

export const WorkItemMoveOrderDTOSchema = z.union([
	z.object({
		type: z.literal('FIRST')
	}),
	z.object({
		type: z.literal('LAST')
	}),
	z.object({
		type: z.literal('BETWEEN'),
		after: WorkItemIdDTOSchema,
		before: WorkItemIdDTOSchema
	})
]);

export type WorkItemMoveOrderDTO = z.infer<typeof WorkItemMoveOrderDTOSchema>;
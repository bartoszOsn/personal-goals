import { z } from 'zod';
import { QuarterDTOSchema } from '../common/QuarterDTO.js';

export const SprintIdDTOSchema = z.uuid();
export const SprintStatusDTOSchema = z.enum(['completed', 'active', 'future']);

export const SprintDTOSchema = z.object({
	id: SprintIdDTOSchema,
	name: z.string(),
	context: z.int(),
	quarter: QuarterDTOSchema,
	startDate: z.iso.date(),
	endDate: z.iso.date(),
	status: SprintStatusDTOSchema
});

export type SprintIdDTO = z.infer<typeof SprintIdDTOSchema>;
export type SprintStatusDTO = z.infer<typeof SprintStatusDTOSchema>;
export type SprintDTO = z.infer<typeof SprintDTOSchema>;

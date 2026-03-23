import { z } from 'zod';
import { SprintIdDTOSchema } from './SprintDTO.js';

export const SprintUpdateRequestDTOSchema = z.object({
	startDate: z.iso.date().optional(),
	endDate: z.iso.date().optional(),
});

export const SprintsUpdateRequestDTOSchema = z.record(
	SprintIdDTOSchema,
	SprintUpdateRequestDTOSchema
);

export type SprintsUpdateRequestDTO = z.infer<typeof SprintsUpdateRequestDTOSchema>;
export type SprintUpdateRequestDTO = z.infer<typeof SprintsUpdateRequestDTOSchema>;
import { z } from 'zod';

export const QuarterDTOSchema = z.union([
	z.literal(1),
	z.literal(2),
	z.literal(3),
	z.literal(4),
]);

export type QuarterDTO = z.infer<typeof QuarterDTOSchema>;
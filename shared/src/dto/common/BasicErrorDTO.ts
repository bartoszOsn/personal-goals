import z from 'zod';

export const BasicErrorDTOSchema = z.object({
	code: z.number(),
	title: z.string(),
	message: z.string(),
	severity: z.enum(['warning', 'error']),
	data: z.any().optional(),
});

export type BasicErrorDTO = z.infer<typeof BasicErrorDTOSchema>;
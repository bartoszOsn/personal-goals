import z from 'zod';
import { DocumentIdDTOSchema } from './DocumentIdDTO.js';

export const DocumentRequestDTOSchema = z.object({
	name: DocumentIdDTOSchema.optional(),
	description: z.string().optional(),
});

export const DocumentsRequestDTOSchema = z.record(
	DocumentIdDTOSchema,
	DocumentRequestDTOSchema
);

export type DocumentsRequestDTO = z.infer<typeof DocumentsRequestDTOSchema>;
export type DocumentRequestDTO = z.infer<typeof DocumentRequestDTOSchema>;

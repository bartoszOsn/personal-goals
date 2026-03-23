import z from 'zod';
import { DocumentIdDTOSchema } from './DocumentIdDTO.js';

export const DocumentDTOSchema = z.object({
	id: DocumentIdDTOSchema,
	name: z.string(),
	editedAt: z.string()
});

export type DocumentDTO = z.infer<typeof DocumentDTOSchema>;

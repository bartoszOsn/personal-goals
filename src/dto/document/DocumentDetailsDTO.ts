import z from 'zod';
import { DocumentDTO, DocumentDTOSchema } from './DocumentDTO.js';

export const DocumentDetailsDTOSchema = DocumentDTOSchema.extend({
	description: z.string()
});

export type DocumentDetailsDTO = z.infer<typeof DocumentDetailsDTOSchema>;
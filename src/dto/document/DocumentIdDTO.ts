import { z } from 'zod';

export const DocumentIdDTOSchema = z.uuid();

export type DocumentIdDTO = z.infer<typeof DocumentIdDTOSchema>;
import z from 'zod';

export const WorkItemStatusDTOSchema = z.enum(['todo', 'inProgress', 'done', 'failed']);

export type WorkItemStatusDTO = z.infer<typeof WorkItemStatusDTOSchema>;

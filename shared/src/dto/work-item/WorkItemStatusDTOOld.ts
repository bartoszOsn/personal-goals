import z from 'zod';

export const WorkItemStatusDTOSchemaOld = z.enum(['todo', 'inProgress', 'done', 'failed']);

export type WorkItemStatusDTOOld = z.infer<typeof WorkItemStatusDTOSchemaOld>;

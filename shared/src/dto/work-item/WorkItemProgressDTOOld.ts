import { z } from 'zod';

export const WorkItemProgressDTOSchemaOld = z.object({
	progress: z.number().min(0).max(100),
	canChange: z.boolean()
});

export type WorkItemProgressDTOOld = z.infer<typeof WorkItemProgressDTOSchemaOld>;
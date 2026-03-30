import { z } from 'zod';
import { QuarterDTOSchema } from '../common/QuarterDTO.js';
import { SprintIdDTOSchema } from '../sprint/SprintDTO.js';

export const WorkItemTimeFrameBaseDTOSchemaOld = z.object({
	startDate: z.iso.date(),
	endDate: z.iso.date(),
	context: z.int(),
});

export const WholeYearWorkItemTimeFrameDTOSchemaOld = WorkItemTimeFrameBaseDTOSchemaOld.extend({
	type: z.literal('whole-year')
});

export const QuarterWorkItemTimeFrameDTOSchemaOld = WorkItemTimeFrameBaseDTOSchemaOld.extend({
	type: z.literal('quarter'),
	quarter: QuarterDTOSchema
});

export const CustomDateWorkItemTimeFrameDTOSchemaOld = WorkItemTimeFrameBaseDTOSchemaOld.extend({
	type: z.literal('custom-date')
});

export const SprintWorkItemTimeFrameDTOSchemaOld = WorkItemTimeFrameBaseDTOSchemaOld.extend({
	type: z.literal('sprint'),
	sprintId: SprintIdDTOSchema
});

export const WorkItemTimeFrameDTOSchemaOld = z.union([
	WholeYearWorkItemTimeFrameDTOSchemaOld,
	QuarterWorkItemTimeFrameDTOSchemaOld,
	CustomDateWorkItemTimeFrameDTOSchemaOld,
	SprintWorkItemTimeFrameDTOSchemaOld
])

export type WorkItemTimeFrameBaseDTOOld = z.infer<typeof WorkItemTimeFrameBaseDTOSchemaOld>;
export type WholeYearWorkItemTimeFrameDTOOld = z.infer<typeof WholeYearWorkItemTimeFrameDTOSchemaOld>;
export type QuarterWorkItemTimeFrameDTOOld = z.infer<typeof QuarterWorkItemTimeFrameDTOSchemaOld>;
export type CustomDateWorkItemTimeFrameDTOOld = z.infer<typeof CustomDateWorkItemTimeFrameDTOSchemaOld>;
export type SprintWorkItemTimeFrameDTOOld = z.infer<typeof SprintWorkItemTimeFrameDTOSchemaOld>;
export type WorkItemTimeFrameDTOOld = z.infer<typeof WorkItemTimeFrameDTOSchemaOld>;
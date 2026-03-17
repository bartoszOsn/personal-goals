import { z } from 'zod';
import { QuarterDTOSchema } from '../common/QuarterDTO.js';
import { SprintIdDTOSchema } from '../sprint/SprintDTO.js';

export const WorkItemTimeFrameBaseDTOSchema = z.object({
	startDate: z.iso.date(),
	endDate: z.iso.date(),
	context: z.int(),
});

export const WholeYearWorkItemTimeFrameDTOSchema = WorkItemTimeFrameBaseDTOSchema.extend({
	type: z.literal('whole-year')
});

export const QuarterWorkItemTimeFrameDTOSchema = WorkItemTimeFrameBaseDTOSchema.extend({
	type: z.literal('quarter'),
	quarter: QuarterDTOSchema
});

export const CustomDateWorkItemTimeFrameDTOSchema = WorkItemTimeFrameBaseDTOSchema.extend({
	type: z.literal('custom-date')
});

export const SprintWorkItemTimeFrameDTOSchema = WorkItemTimeFrameBaseDTOSchema.extend({
	type: z.literal('sprint'),
	sprintId: SprintIdDTOSchema
});

export const WorkItemTimeFrameDTOSchema = z.union([
	WholeYearWorkItemTimeFrameDTOSchema,
	QuarterWorkItemTimeFrameDTOSchema,
	CustomDateWorkItemTimeFrameDTOSchema,
	SprintWorkItemTimeFrameDTOSchema
])

export type WorkItemTimeFrameBaseDTO = z.infer<typeof WorkItemTimeFrameBaseDTOSchema>;
export type WholeYearWorkItemTimeFrameDTO = z.infer<typeof WholeYearWorkItemTimeFrameDTOSchema>;
export type QuarterWorkItemTimeFrameDTO = z.infer<typeof QuarterWorkItemTimeFrameDTOSchema>;
export type CustomDateWorkItemTimeFrameDTO = z.infer<typeof CustomDateWorkItemTimeFrameDTOSchema>;
export type SprintWorkItemTimeFrameDTO = z.infer<typeof SprintWorkItemTimeFrameDTOSchema>;
export type WorkItemTimeFrameDTO = z.infer<typeof WorkItemTimeFrameDTOSchema>;
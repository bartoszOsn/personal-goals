import { Task } from '@/models/Task.ts';
import { Objective } from '@/models/Objective.ts';
import { WorkItemVariant } from '@/models/WorkItemVariant.ts';
import { KeyResult } from '@/models/KeyResult.ts';

export interface WorkItemVariantMappersWithDefault<TOut> {
	task?: (task: Task) => TOut;
	objective?: (objective: Objective) => TOut;
	keyResult?: (keyResult: KeyResult) => TOut;
	default: (variant: WorkItemVariant) => TOut;
}

export interface WorkItemVariantMappersFull<TOut> {
	task: (task: Task) => TOut;
	objective: (objective: Objective) => TOut;
	keyResult: (keyResult: KeyResult) => TOut;
}

export type WorkItemVariantMappers<TOut> = WorkItemVariantMappersWithDefault<TOut> | WorkItemVariantMappersFull<TOut>;

export function mapWorkItemVariant<TOut>(variant: WorkItemVariant, mappers: WorkItemVariantMappers<TOut>): TOut {
	if ('task' in variant && mappers.task) {
		return mappers.task(variant.task);
	}
	if ('objective' in variant && mappers.objective) {
		return mappers.objective(variant.objective);
	}
	if ('keyResult' in variant && mappers.keyResult) {
		return mappers.keyResult(variant.keyResult);
	}

	if ('default' in mappers) {
		return mappers.default(variant);
	}

	throw new Error('Unrecognized variant mapped for work item');
}
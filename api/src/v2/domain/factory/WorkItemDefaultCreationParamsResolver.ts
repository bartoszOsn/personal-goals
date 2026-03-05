import { ContextYear } from '../model/ContextYear';
import { WorkItemType } from '../model/WorkItemType';
import { WorkItemCreationParams } from './WorkItemCreationParams';
import { UnreachableError } from '../../../util/UnreachableError';
import { WorkItemId } from '../model/WorkItemId';
import { WorkItemStatus } from '../model/WorkItemStatus';
import {
	ChildrenProgressBasedWorkItemProgress,
	ChildrenStatusBasedWorkItemProgress,
	ManualWorkItemProgress,
	Percentage
} from '../model/WorkItemProgress';

export class WorkItemDefaultCreationParamsResolver {
	public static getDefaultCreationParamsForType(
		context: ContextYear,
		type: WorkItemType
	): WorkItemCreationParams {
		switch (type) {
			case WorkItemType.TASK:
				return this.getDefaultTaskCreationParamsForTask(context);
			case WorkItemType.OBJECTIVE:
				return this.getDefaultObjectiveCreationParamsForObjective(
					context
				);
			case WorkItemType.KEY_RESULT:
				return this.getDefaultKeyResultCreationParamsForKeyResult(
					context
				);
			default:
				throw new UnreachableError(type);
		}
	}

	private static getDefaultTaskCreationParamsForTask(
		context: ContextYear
	): WorkItemCreationParams {
		return [
			WorkItemType.TASK,
			WorkItemId.random(),
			context,
			'New task',
			'',
			null,
			WorkItemStatus.TO_DO,
			new ManualWorkItemProgress(Percentage.zero())
		];
	}

	private static getDefaultObjectiveCreationParamsForObjective(
		context: ContextYear
	): WorkItemCreationParams {
		return [
			WorkItemType.OBJECTIVE,
			WorkItemId.random(),
			context,
			'New objective',
			'',
			null,
			WorkItemStatus.TO_DO,
			new ChildrenProgressBasedWorkItemProgress([])
		];
	}

	private static getDefaultKeyResultCreationParamsForKeyResult(
		context: ContextYear
	): WorkItemCreationParams {
		return [
			WorkItemType.KEY_RESULT,
			WorkItemId.random(),
			context,
			'New key result',
			'',
			null,
			WorkItemStatus.TO_DO,
			new ChildrenStatusBasedWorkItemProgress([])
		];
	}
}

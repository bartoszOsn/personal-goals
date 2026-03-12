import { ContextYear } from '../../common/model/ContextYear';
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
import { WorkItemDescription } from '../model/WorkItemDescription';
import { WorkItemTitle } from '../model/WorkItemTitle';

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
			new WorkItemTitle('New task'),
			WorkItemDescription.empty(),
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
			new WorkItemTitle('New objective'),
			WorkItemDescription.empty(),
			null,
			WorkItemStatus.TO_DO,
			new ChildrenProgressBasedWorkItemProgress()
		];
	}

	private static getDefaultKeyResultCreationParamsForKeyResult(
		context: ContextYear
	): WorkItemCreationParams {
		return [
			WorkItemType.KEY_RESULT,
			WorkItemId.random(),
			context,
			new WorkItemTitle('New key result'),
			WorkItemDescription.empty(),
			null,
			WorkItemStatus.TO_DO,
			new ChildrenStatusBasedWorkItemProgress()
		];
	}
}

import { WorkItem } from '../model/WorkItem';
import { WorkItemType } from '../model/WorkItemType';
import { InvalidWorkItemHierarchyException } from '../error/InvalidWorkItemHierarchyException';
import { UnreachableError } from '../../../util/UnreachableError';
import {
	ChildrenProgressBasedWorkItemProgress,
	ChildrenStatusBasedWorkItemProgress,
	ManualWorkItemProgress
} from '../model/WorkItemProgress';
import { InvalidWorkItemProgressTypeException } from '../error/InvalidWorkItemProgressTypeException';

export class WorkItemHierarchyValidator {
	static validateRoot(root: WorkItem): void {
		if (root.parent !== null) {
			throw new InvalidWorkItemHierarchyException(
				'Root work item cannot have a parent'
			);
		}

		this.validate(root);
	}

	private static validate(workItem: WorkItem): void {
		switch (workItem.type) {
			case WorkItemType.OBJECTIVE:
				this.validateObjective(workItem);
				break;
			case WorkItemType.KEY_RESULT:
				this.validateKeyResult(workItem);
				break;
			case WorkItemType.TASK:
				this.validateTask(workItem);
				break;
			default:
				throw new UnreachableError(workItem.type);
		}

		for (const child of workItem.children) {
			if (!workItem.contextYear.equals(child.contextYear)) {
				throw new InvalidWorkItemHierarchyException(
					"Children must belong to same year as it's parent"
				);
			}
			this.validate(child);
		}
	}

	private static validateObjective(objective: WorkItem): void {
		if (objective.parent) {
			throw new InvalidWorkItemHierarchyException(
				'Objective must be a top-level work item'
			);
		}

		for (const child of objective.children) {
			if (child.type !== WorkItemType.KEY_RESULT) {
				throw new InvalidWorkItemHierarchyException(
					'Children of an objective must be key results'
				);
			}
		}

		if (
			!(
				objective.progress instanceof
				ChildrenProgressBasedWorkItemProgress
			)
		) {
			throw new InvalidWorkItemProgressTypeException(
				"Objective must have a progress type based on it's children's progress"
			);
		}
	}

	private static validateKeyResult(keyResult: WorkItem): void {
		if (keyResult.parent?.type !== WorkItemType.OBJECTIVE) {
			throw new InvalidWorkItemHierarchyException(
				'Key result must have an objective as a parent'
			);
		}

		for (const child of keyResult.children) {
			if (child.type !== WorkItemType.TASK) {
				throw new InvalidWorkItemHierarchyException(
					'Children of a key result must be tasks'
				);
			}
		}

		if (
			!(keyResult.progress instanceof ChildrenStatusBasedWorkItemProgress)
		) {
			throw new InvalidWorkItemProgressTypeException(
				"Key result must have a progress type based on it's children's status"
			);
		}
	}

	private static validateTask(task: WorkItem): void {
		if (task.parent?.type === WorkItemType.OBJECTIVE) {
			throw new InvalidWorkItemHierarchyException(
				'Task must have a key result as a parent'
			);
		}

		if (task.children.length > 0) {
			throw new InvalidWorkItemHierarchyException(
				'Tasks cannot have children'
			);
		}

		if (!(task.progress instanceof ManualWorkItemProgress)) {
			throw new InvalidWorkItemHierarchyException(
				'Tasks must have a manual progress type'
			);
		}
	}
}

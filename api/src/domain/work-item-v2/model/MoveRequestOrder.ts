import { WorkItemId } from './WorkItemId';

export class MoveRequestOrder {
	constructor(
		public readonly type: WorkItemHierarchyMoveRequestOrderType,
		public readonly after?: WorkItemId,
		public readonly before?: WorkItemId
	) {
		if (type === WorkItemHierarchyMoveRequestOrderType.BETWEEN) {
			if (!this.after || !this.before) {
				throw new Error(
					'Both after and before must be provided for BETWEEN order'
				);
			}
		} else {
			if (this.after || this.before) {
				throw new Error(
					"Both after and before can't be provided for FIRST or LAST order"
				);
			}
		}
	}

	isFirst(): this is MoveRequestOrder & {
		after: undefined;
		before: undefined;
	} {
		return this.type === WorkItemHierarchyMoveRequestOrderType.FIRST;
	}

	isLast(): this is MoveRequestOrder & {
		after: undefined;
		before: undefined;
	} {
		return this.type === WorkItemHierarchyMoveRequestOrderType.LAST;
	}

	isBetween(): this is MoveRequestOrder & {
		after: WorkItemId;
		before: WorkItemId;
	} {
		return this.type === WorkItemHierarchyMoveRequestOrderType.BETWEEN;
	}
}

export enum WorkItemHierarchyMoveRequestOrderType {
	FIRST = 'FIRST',
	LAST = 'LAST',
	BETWEEN = 'BETWEEN'
}

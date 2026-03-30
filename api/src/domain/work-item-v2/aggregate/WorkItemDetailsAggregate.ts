import { WorkItem } from '../model/WorkItem';

export class WorkItemDetailsAggregate {
	constructor(public readonly workItem: WorkItem) {}
}

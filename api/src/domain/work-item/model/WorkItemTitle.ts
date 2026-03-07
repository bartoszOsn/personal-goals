import { InvalidWorkItemNameError } from '../error/InvalidWorkItemNameError';

export class WorkItemTitle {
	constructor(public readonly title: string) {
		if (title.length === 0) {
			throw new InvalidWorkItemNameError(
				'Work item title cannot be empty'
			);
		}
	}
}

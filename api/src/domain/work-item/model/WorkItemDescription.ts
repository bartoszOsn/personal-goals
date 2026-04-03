export class WorkItemDescription {
	constructor(public readonly description: string) {}

	static empty(): WorkItemDescription {
		return new WorkItemDescription('');
	}
}

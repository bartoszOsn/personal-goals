export class WorkItemId {
	constructor(public readonly id: string) {}

	static random(): WorkItemId {
		return new WorkItemId(crypto.randomUUID());
	}

	equals(other: WorkItemId): boolean {
		return this.id === other.id;
	}
}

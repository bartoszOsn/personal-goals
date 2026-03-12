export class SprintId {
	constructor(public readonly value: string) {}

	static random(): SprintId {
		return new SprintId(crypto.randomUUID());
	}

	equals(id: SprintId) {
		return this.value === id.value;
	}
}

export class SprintId {
	constructor(public readonly value: string) {}

	equals(id: SprintId) {
		return this.value === id.value;
	}
}

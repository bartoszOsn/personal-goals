export class DocumentId {
	constructor(public readonly id: string) {}

	static random(): DocumentId {
		return new DocumentId(crypto.randomUUID());
	}

	equals(other: DocumentId): boolean {
		return this.id === other.id;
	}
}

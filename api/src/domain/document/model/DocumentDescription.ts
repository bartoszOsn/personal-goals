export class DocumentDescription {
	constructor(public readonly description: string) {}

	static empty(): DocumentDescription {
		return new DocumentDescription('');
	}
}

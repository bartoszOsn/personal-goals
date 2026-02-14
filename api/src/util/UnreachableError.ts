export class UnreachableError extends Error {
	constructor(public readonly unexpectedValue: never) {
		super("Oops, shouldn't reach that code. Value: " + unexpectedValue);
	}
}

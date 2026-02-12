export class HttpError<TData = unknown> extends Error {
	public readonly statusCode: number;
	public readonly data: TData;

	constructor(
		statusCode: number,
		data: TData
	) {
		super();
		this.data = data;
		this.statusCode = statusCode;
	}

	isOfType<TNarrow>(code: number): this is HttpError<TNarrow> {
		return this.statusCode === code;
	}

	static is<TNarrow>(error: any, code: number): error is HttpError<TNarrow> {
		return error instanceof HttpError && error.statusCode === code;
	}
}

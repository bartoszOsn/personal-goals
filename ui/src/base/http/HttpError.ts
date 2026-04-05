import { z } from 'zod';

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

	is<TSchema extends z.ZodType>(schema: TSchema): this is HttpError<z.infer<TSchema>> {
		return z.safeParse(schema, this.data).success;
	}

	static is<TSchema extends z.ZodType>(error: unknown, schema: TSchema): error is HttpError<z.infer<TSchema>> {
		return error instanceof HttpError && error.is(schema);
	}
}

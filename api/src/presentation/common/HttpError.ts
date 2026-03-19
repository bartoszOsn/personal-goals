import { BasicErrorDTOSchema } from '@personal-okr/shared';
import { z } from 'zod';

export class HttpError<TSchema extends typeof BasicErrorDTOSchema> {
	public readonly data: z.infer<TSchema>;

	constructor(
		public readonly schema: TSchema,
		data: z.infer<TSchema>
	) {
		this.data = z.parse(schema, data);
	}
}

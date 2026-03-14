import { DocumentId } from './DocumentId';
import { DocumentTitle } from './DocumentTitle';
import { DocumentDescription } from './DocumentDescription';
import { Temporal } from 'temporal-polyfill';
import { ContextYear } from '../../common/model/ContextYear';
import { DocumentUpdateRequest } from './DocumentUpdateRequest';

export class Document {
	constructor(
		public readonly id: DocumentId,
		public readonly context: ContextYear,
		public readonly title: DocumentTitle,
		public readonly description: DocumentDescription,
		public readonly editedAt: Temporal.PlainDateTime
	) {}

	static defaultDocument(
		context: ContextYear,
		now: Temporal.PlainDateTime
	): Document {
		return new Document(
			DocumentId.random(),
			context,
			DocumentTitle.defaultTitle(),
			DocumentDescription.empty(),
			now
		);
	}

	updated(request: DocumentUpdateRequest, now: Temporal.PlainDateTime) {
		return new Document(
			this.id,
			this.context,
			request.name === undefined ? this.title : request.name,
			request.description === undefined
				? this.description
				: request.description,
			now
		);
	}
}

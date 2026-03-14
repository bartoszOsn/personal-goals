import { DocumentId } from './DocumentId';
import { DocumentTitle } from './DocumentTitle';
import { DocumentDescription } from './DocumentDescription';
import { Temporal } from 'temporal-polyfill';

export class Document {
	constructor(
		public readonly id: DocumentId,
		public readonly title: DocumentTitle,
		public readonly description: DocumentDescription,
		public readonly editedAt: Temporal.PlainDateTime
	) {}

	static defaultDocument(now: Temporal.PlainDateTime): Document {
		return new Document(
			DocumentId.random(),
			DocumentTitle.defaultTitle(),
			DocumentDescription.empty(),
			now
		);
	}

	withTitle(newTitle: DocumentTitle, now: Temporal.PlainDateTime) {
		return new Document(this.id, newTitle, this.description, now);
	}

	withDescription(
		newDescription: DocumentDescription,
		now: Temporal.PlainDateTime
	) {
		return new Document(this.id, this.title, newDescription, now);
	}
}

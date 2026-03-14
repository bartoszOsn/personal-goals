import { DocumentId } from './DocumentId';
import { DocumentTitle } from './DocumentTitle';
import { DocumentDescription } from './DocumentDescription';
import { Temporal } from 'temporal-polyfill';

export class Document {
	constructor(
		public readonly id: DocumentId,
		public readonly title: DocumentTitle,
		public readonly description: DocumentDescription,
		public readonly editedAt: Temporal.PlainDate
	) {}

	static defaultDocument(now: Temporal.PlainDate): Document {
		return new Document(
			DocumentId.random(),
			DocumentTitle.defaultTitle(),
			DocumentDescription.empty(),
			now
		);
	}

	withTitle(newTitle: DocumentTitle, now: Temporal.PlainDate) {
		return new Document(this.id, newTitle, this.description, now);
	}

	withDescription(
		newDescription: DocumentDescription,
		now: Temporal.PlainDate
	) {
		return new Document(this.id, this.title, newDescription, now);
	}
}

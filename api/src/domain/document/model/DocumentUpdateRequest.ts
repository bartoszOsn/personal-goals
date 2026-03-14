import { DocumentId } from './DocumentId';
import { DocumentTitle } from './DocumentTitle';
import { DocumentDescription } from './DocumentDescription';

export class DocumentUpdateRequest {
	constructor(
		public readonly id: DocumentId,
		public readonly name?: DocumentTitle,
		public readonly description?: DocumentDescription
	) {}
}

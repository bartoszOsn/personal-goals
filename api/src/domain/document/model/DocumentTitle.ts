import { InvalidDocumentNameError } from '../error/InvalidDocumentNameError';

export class DocumentTitle {
	constructor(public readonly title: string) {
		if (title.length === 0) {
			throw new InvalidDocumentNameError(
				'Document title cannot be empty'
			);
		}
	}

	static defaultTitle(): DocumentTitle {
		return new DocumentTitle('New Document');
	}
}

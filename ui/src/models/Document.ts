import { Temporal } from 'temporal-polyfill';

export interface Document {
	readonly id: DocumentId;
	readonly name: string;
	readonly editedAt: Temporal.PlainDateTime;
}

export interface DocumentDetails extends Document {
	description: string;
}

export interface DocumentsRequest {
	[id: DocumentId]: DocumentRequest;
}

export interface DocumentRequest {
	name?: string;
	description?: string;
}

export type DocumentId = string & { _brand: 'DocumentId' };
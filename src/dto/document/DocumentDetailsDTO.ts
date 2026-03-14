import { DocumentDTO } from './DocumentDTO.js';

export interface DocumentDetailsDTO extends DocumentDTO {
	readonly description: string;
}
export interface DocumentsRequestDTO {
	[id: string]: DocumentRequestDTO;
}

export interface DocumentRequestDTO {
	name?: string;
	description?: string;
}
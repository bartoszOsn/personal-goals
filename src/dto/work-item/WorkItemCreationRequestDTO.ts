import { WorkItemTypeDTO } from './WorkItemTypeDTO.js';

export interface WorkItemCreationRequestDTO {
	context: number;
	type: WorkItemTypeDTO;
	parentId?: string;
}
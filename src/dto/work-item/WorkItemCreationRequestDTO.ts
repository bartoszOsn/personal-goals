import { WorkItemTypeDTO } from './WorkItemTypeDTO.js';
import { WorkItemUpdateRequestDTO } from './WorkItemUpdateRequestDTO.js';

export interface WorkItemCreationRequestDTO {
	context: number;
	type: WorkItemTypeDTO;
	parentId?: string;
	fields?: WorkItemUpdateRequestDTO;
}
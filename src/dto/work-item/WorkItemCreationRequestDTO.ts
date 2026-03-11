import { WorkItemTypeDTO } from './WorkItemTypeDTO.js';
import { WorkItemUpdateRequestDTO } from '../../../types/index.js';

export interface WorkItemCreationRequestDTO {
	context: number;
	type: WorkItemTypeDTO;
	parentId?: string;
	fields?: WorkItemUpdateRequestDTO;
}
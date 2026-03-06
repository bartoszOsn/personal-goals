import { WorkItemTypeDTO } from './WorkItemTypeDTO.js';
import { WorkItemStatusDTO } from './WorkItemStatusDTO.js';
import { WorkItemTimeFrameDTO } from './WorkItemTimeFrameDTO.js';

export interface WorkItemUpdateRequestDTO {
	contextYear?: number,
	type?: WorkItemTypeDTO,
	title?: string,
	description?: string,
	timeFrame?: { empty: true } | { value: WorkItemTimeFrameDTO },
	status?: WorkItemStatusDTO,
	progress?: number
}
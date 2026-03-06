import { WorkItemTypeDTO } from './WorkItemTypeDTO.js';
import { WorkItemStatusDTO } from './WorkItemStatusDTO.js';
import { WorkItemProgressDTO } from './WorkItemProgressDTO.js';
import { WorkItemTimeFrameDTO } from './WorkItemTimeFrameDTO.js';

export interface WorkItemDTO {
	id: string;
	type: WorkItemTypeDTO;
	contextYear: number;
	title: string;
	description: string;
	timeFrame?: WorkItemTimeFrameDTO;
	status: WorkItemStatusDTO;
	progress: WorkItemProgressDTO;
}
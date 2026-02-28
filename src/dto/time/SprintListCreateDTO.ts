import { SprintListDTO } from './SprintListDTO.js';

export type SprintListCreateDTO = SprintCreateSuccessDTO | SprintCreateOverlapFailureDTO;

export interface SprintCreateSuccessDTO {
	status: 'success';
	addedSprints: SprintListDTO;
}

export interface SprintCreateOverlapFailureDTO {
	status: 'failure';
	reason: 'overlap';
	conflictingSprings: SprintListDTO
}
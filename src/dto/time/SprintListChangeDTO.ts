import { SprintListDTO } from './SprintListDTO';

export type SprintListChangeDTO = SprintChangeSuccessDTO | SprintChangeOverlapFailureDTO;

export interface SprintChangeSuccessDTO {
	status: 'success';
	addedSprints: SprintListDTO;
	modifiedSprints: SprintListDTO;
}

export interface SprintChangeOverlapFailureDTO {
	status: 'failure';
	reason: 'overlap';
	conflictingSprings: SprintListDTO;
}
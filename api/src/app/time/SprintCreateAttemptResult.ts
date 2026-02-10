import { Sprint } from '../../domain/time/model/Sprint';

export class SprintCreateAttemptSuccessResult {
	readonly isSuccess = true as const;

	constructor(public readonly addedSprints: Sprint[]) {}
}

export class SprintCreateAttemptOverlapFailureResult {
	readonly isSuccess = false as const;
	constructor(public readonly conflictingSprings: Sprint[]) {}
}

export type SprintCreateAttemptResult =
	| SprintCreateAttemptSuccessResult
	| SprintCreateAttemptOverlapFailureResult;

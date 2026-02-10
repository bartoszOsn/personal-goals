import { Sprint } from '../../domain/time/model/Sprint';

export class SprintChangeAttemptSuccessResult {
	readonly isSuccess = true as const;

	constructor(public readonly modifiedSprints: Sprint[]) {}
}

export class SprintChangeAttemptOverlapFailureResult {
	readonly isSuccess = false as const;
	constructor(public readonly conflictingSprings: Map<Sprint, Sprint[]>) {}
}

export type SprintChangeAttemptResult =
	| SprintChangeAttemptSuccessResult
	| SprintChangeAttemptOverlapFailureResult;

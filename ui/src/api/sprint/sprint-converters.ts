import { QuarterDTO, SprintBulkCreateRequestDTO, SprintChangeRequestDTO, SprintDTO } from '@personal-okr/shared';
import { Sprint, SprintBulkCreateRequest, SprintChangeRequest, SprintDuration, SprintId, SprintStatus } from '@/models/Sprint.ts';
import { Temporal } from 'temporal-polyfill';
import { numberToQuarter, Quarter } from '@/models/Quarter';

export function dtoToSprints(list: SprintDTO[]): Sprint[] {
	return list.map(dtoToSprint);
}

export function dtoToSprint(dto: SprintDTO): Sprint {
	return {
		id: dto.id as SprintId,
		year: dto.context,
		quarter: numberToQuarter[dto.quarter],
		name: dto.name,
		startDate: Temporal.PlainDate.from(dto.startDate),
		endDate: Temporal.PlainDate.from(dto.endDate),
		status: dtoToSprintStatus(dto.status),
	};
}

export function sprintBulkCreateRequestToDTO(request: SprintBulkCreateRequest): SprintBulkCreateRequestDTO {
	return {
		startDate: request.startDate.toJSON(),
		numberOfSprints: request.numberOfSprints,
		sprintDuration: dtoToSprintDuration(request.sprintDuration)
	}
}

export function sprintChangeRequestToDTO(request: SprintChangeRequest): SprintChangeRequestDTO {
	return Object.fromEntries(
		Object.entries(request).map(([sprintId, value]) => [sprintId, {
			newStartDate: value.newStartDate.toJSON(),
			newEndDate: value.newEndDate.toJSON(),
		}])
	);
}

export function dtoToQuarter(dto: QuarterDTO): Quarter {
	switch (dto) {
		case 'Q1':
			return Quarter.Q1;
		case 'Q2':
			return Quarter.Q2;
		case 'Q3':
			return Quarter.Q3;
		case 'Q4':
			return Quarter.Q4;
		default:
			throw new Error(`Unknown dto: ${dto}`);
	}
}

function dtoToSprintStatus(status: SprintDTO['status']): SprintStatus {
	switch (status) {
		case 'completed':
			return SprintStatus.COMPLETED;
		case 'active':
			return SprintStatus.ACTIVE;
		case 'future':
			return SprintStatus.FUTURE;
		default:
			throw new Error(`Unknown status: ${status}`);
	}
}

function dtoToSprintDuration(dto: SprintDuration): SprintBulkCreateRequestDTO['sprintDuration'] {
	switch (dto) {
		case SprintDuration.WEEK:
			return 'week';
		case SprintDuration.TWO_WEEKS:
			return 'two-weeks';
		case SprintDuration.MONTH:
			return 'month';
		default:
			throw new Error(`Unknown duration: ${dto}`);
	}
}
import { SprintDTO, SprintsUpdateRequestDTO } from '@personal-okr/shared';
import { Sprint, SprintChangeRequest, SprintId, SprintStatus } from '@/models/Sprint.ts';
import { Temporal } from 'temporal-polyfill';
import { numberToQuarter } from '@/models/Quarter';

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

export function sprintChangeRequestToDTO(request: SprintChangeRequest): SprintsUpdateRequestDTO {
	return Object.fromEntries(
		Object.entries(request).map(([sprintId, value]) => [sprintId, {
			startDate: value.newStartDate?.toJSON(),
			endDate: value.newEndDate?.toJSON(),
		}])
	);
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

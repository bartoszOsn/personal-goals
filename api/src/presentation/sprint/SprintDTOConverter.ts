import { Injectable } from '@nestjs/common';
import { SprintContextCollection } from '../../domain/sprint/model/SprintContextCollection';
import { SprintDTO, SprintsUpdateRequestDTO } from '@personal-okr/shared';
import { quarterToNumber } from '../../domain/common/model/Quarter';
import { SprintUpdateRequest } from '../../domain/sprint/model/SprintUpdateRequest';
import { SprintId } from '../../domain/sprint/model/SprintId';
import { Temporal } from 'temporal-polyfill';
import { SprintStatus } from '../../domain/sprint/model/SprintStatus';
import { UnreachableError } from '../../util/UnreachableError';

@Injectable()
export class SprintDTOConverter {
	toSprintsDTO(sprintCollection: SprintContextCollection): SprintDTO[] {
		return sprintCollection.sprints.map((sprint) => ({
			id: sprint.id.value,
			name: sprint.name,
			context: sprint.context.year,
			quarter: quarterToNumber(sprint.quarter),
			startDate: sprint.startDate.toString(),
			endDate: sprint.endDate.toString(),
			status: this.toSprintStatusDTO(
				sprint.getStatus(Temporal.Now.plainDateISO())
			)
		}));
	}

	fromSprintsUpdateRequestDTO(
		dto: SprintsUpdateRequestDTO
	): SprintUpdateRequest[] {
		return Object.entries(dto).map(
			([id, sprint]) =>
				new SprintUpdateRequest(
					new SprintId(id),
					sprint.startDate === undefined
						? undefined
						: Temporal.PlainDate.from(sprint.startDate),
					sprint.endDate === undefined
						? undefined
						: Temporal.PlainDate.from(sprint.endDate)
				)
		);
	}

	private toSprintStatusDTO(status: SprintStatus): SprintDTO['status'] {
		switch (status) {
			case SprintStatus.COMPLETED:
				return 'completed';
			case SprintStatus.FUTURE:
				return 'future';
			case SprintStatus.ACTIVE:
				return 'active';
			default:
				throw new UnreachableError(status);
		}
	}
}

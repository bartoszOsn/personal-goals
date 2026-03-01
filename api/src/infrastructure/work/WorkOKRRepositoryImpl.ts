import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { WorkOKRRepository } from '../../app/work/WorkOKRRepository';
import { User } from 'src/domain/auth/model/User';
import { KeyResult, KeyResultId } from 'src/domain/work/model/KeyResult';
import { KeyResultRequest } from 'src/domain/work/model/KeyResultRequest';
import { Objective, ObjectiveId } from 'src/domain/work/model/Objective';
import { ObjectiveRequest } from 'src/domain/work/model/ObjectiveRequest';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectiveEntity } from './entity/ObjectiveEntity';
import { Repository } from 'typeorm';
import { KeyResultEntity } from './entity/KeyResultEntity';
import { UserEntity } from '../auth/entity/UserEntity';
import { WorkOKREntityConverter } from './WorkOKREntityConverter';
import { ProgressCalculationType } from '../../domain/work/model/ProgressCalculationType';
import { TaskEntity } from './entity/TaskEntity';

@Injectable()
export class WorkOKRRepositoryImpl extends WorkOKRRepository {
	constructor(
		@InjectRepository(ObjectiveEntity)
		private readonly objectiveRepository: Repository<ObjectiveEntity>,
		@InjectRepository(KeyResultEntity)
		private readonly keyResultRepository: Repository<KeyResultEntity>,
		private readonly workOKREntityConverter: WorkOKREntityConverter
	) {
		super();
	}

	async getObjectives(user: User): Promise<Objective[]> {
		const entities = await this.objectiveRepository.find({
			where: {
				user: { id: user.id.id } as unknown as UserEntity
			},
			relations: {
				keyResults: {
					associatedTasks: true
				}
			}
		});

		return this.workOKREntityConverter.fromObjectiveEntities(entities);
	}

	async createObjective(
		user: User,
		request: ObjectiveRequest
	): Promise<Objective> {
		const entity = this.workOKREntityConverter.toObjectiveEntity(
			user,
			request
		);
		entity.description = '';
		entity.keyResults = [];
		const createdEntity = await this.objectiveRepository.save(entity);
		return this.workOKREntityConverter.fromObjectiveEntity(createdEntity);
	}

	async updateObjective(
		user: User,
		id: ObjectiveId,
		request: ObjectiveRequest
	): Promise<void> {
		const entity = this.workOKREntityConverter.toObjectiveEntity(
			user,
			request
		);
		entity.id = id.id;
		await this.objectiveRepository.save(entity);
	}

	async deleteObjective(user: User, id: ObjectiveId): Promise<void> {
		await this.objectiveRepository.delete({
			user: { id: user.id.id } as unknown as UserEntity,
			id: id.id
		});
	}

	async createKeyResult(
		user: User,
		parentId: ObjectiveId,
		request: KeyResultRequest
	): Promise<KeyResult> {
		const entity = this.workOKREntityConverter.toKeyResultEntity(request);
		entity.objective = {
			id: parentId.id,
			user: { id: user.id.id } as unknown as UserEntity
		} as unknown as ObjectiveEntity;
		entity.description ??= '';
		entity.progress ??= 0;
		entity.progressCalculationType ??= 'PERCENTAGE';
		const updated = await this.keyResultRepository.save(entity);
		const updatedEntity = await this.keyResultRepository.findOne({
			where: {
				id: updated.id
			},
			relations: {
				associatedTasks: true,
				objective: true
			}
		});

		if (!updatedEntity) {
			throw new NotFoundException('Key not found');
		}
		return this.workOKREntityConverter.fromKeyResultEntity(updatedEntity);
	}

	async updateKeyResult(
		user: User,
		id: KeyResultId,
		request: KeyResultRequest
	): Promise<KeyResult> {
		// Fetch existing key result to check calculation type
		const existingEntity = await this.keyResultRepository.findOne({
			where: {
				id: id.id,
				objective: {
					user: { id: user.id.id }
				}
			},
			relations: {
				associatedTasks: true
			}
		});

		if (!existingEntity) {
			throw new NotFoundException('Key result not found');
		}

		// Determine the calculation type (use new one if provided, otherwise use existing)
		const calculationType =
			request.progressCalculationType !== null
				? this.workOKREntityConverter[
						'toProgressCalculationTypeEntity'
					](request.progressCalculationType)
				: existingEntity.progressCalculationType;

		// Validate progress update: only allow manual progress update for YES_NO and PERCENTAGE
		if (request.progress !== null && calculationType === 'TASKS') {
			throw new BadRequestException(
				'Cannot manually update progress when calculation type is TASKS. Progress is calculated from associated tasks.'
			);
		}

		const entity = this.workOKREntityConverter.toKeyResultEntity(request);
		entity.id = id.id;

		await this.keyResultRepository.update(
			{
				objective: {
					user: { id: user.id.id } as unknown as UserEntity
				} as unknown as ObjectiveEntity
			},
			entity
		);

		// Fetch updated entity with relations
		const updatedEntity = await this.keyResultRepository.findOne({
			where: {
				id: id.id
			},
			relations: {
				associatedTasks: true,
				objective: true
			}
		});

		if (!updatedEntity) {
			throw new NotFoundException('Key result not found');
		}

		return this.workOKREntityConverter.fromKeyResultEntity(updatedEntity);
	}

	async deleteKeyResult(user: User, id: KeyResultId): Promise<void> {
		const entity = await this.keyResultRepository.findOne({
			where: {
				objective: {
					user: { id: user.id.id }
				},
				id: id.id
			}
		});

		if (!entity) {
			throw new NotFoundException(); // Throw application event.
		}

		await this.keyResultRepository.delete(entity.id);
	}
}

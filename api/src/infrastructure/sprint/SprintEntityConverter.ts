import { Injectable } from '@nestjs/common';
import { SprintEntity } from './entity/SprintEntity';
import { SprintContextCollection } from '../../domain/sprint/model/SprintContextCollection';
import { SprintFactory } from '../../domain/sprint/factory/SprintFactory';
import { ContextYear } from '../../domain/common/model/ContextYear';
import { SprintId } from '../../domain/sprint/model/SprintId';
import { Temporal } from 'temporal-polyfill';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/auth/model/User';

@Injectable()
export class SprintEntityConverter {
	constructor(
		@InjectRepository(SprintEntity)
		private readonly sprintRepository: Repository<SprintEntity>
	) {}

	fromEntities(
		context: ContextYear,
		entities: SprintEntity[]
	): SprintContextCollection {
		let factory = SprintFactory.empty(context);
		for (const entity of entities) {
			factory = factory.addExisting(
				new SprintId(entity.id),
				Temporal.PlainDate.from(entity.startDate),
				Temporal.PlainDate.from(entity.endDate)
			);
		}

		return factory.build();
	}

	toEntities(
		collection: SprintContextCollection,
		user: User
	): SprintEntity[] {
		return collection.sprints.map((sprint) => {
			return this.sprintRepository.create({
				id: sprint.id.value,
				context: collection.context.year,
				startDate: sprint.startDate.toString(),
				endDate: sprint.endDate.toString(),
				user: { id: user.id.id }
			});
		});
	}
}

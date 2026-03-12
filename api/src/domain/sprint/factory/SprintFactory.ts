import { SprintContextCollection } from '../model/SprintContextCollection';
import { ContextYear } from '../../common/model/ContextYear';
import { Sprint } from '../model/Sprint';
import { SprintId } from '../model/SprintId';
import { Temporal } from 'temporal-polyfill';
import { SprintUpdateRequest } from '../model/SprintUpdateRequest';
import { InvalidSprintContextError } from '../error/InvalidSprintContextError';
import { SprintOverlapError } from '../error/SprintOverlapError';

class SprintImpl extends Sprint {}
class SprintContextCollectionImpl extends SprintContextCollection {
	declare sprints: ReadonlyArray<SprintImpl>;
}

export class SprintFactory {
	private constructor(
		private readonly collection: SprintContextCollectionImpl
	) {}

	static empty(context: ContextYear): SprintFactory {
		return new SprintFactory(new SprintContextCollectionImpl(context, []));
	}

	static from(collection: SprintContextCollection): SprintFactory {
		if (!(collection instanceof SprintContextCollectionImpl)) {
			throw new Error('Invalid collection type');
		}
		return new SprintFactory(collection);
	}

	addExisting(
		id: SprintId,
		start: Temporal.PlainDate,
		end: Temporal.PlainDate
	): SprintFactory {
		const newSprint = new SprintImpl(
			id,
			this.collection.context,
			start,
			end
		);

		const newCollection = new SprintContextCollectionImpl(
			this.collection.context,
			[...this.collection.sprints, newSprint].sort((a, b) =>
				Temporal.PlainDate.compare(a.startDate, b.startDate)
			)
		);

		return new SprintFactory(newCollection);
	}

	fill(): SprintFactory {
		return this; // TODO Implement
	}

	createSprint(): SprintFactory {
		return this; // TODO Implement
	}

	update(request: SprintUpdateRequest): SprintFactory {
		const context = this.collection.context;
		const sprints = this.collection.sprints
			.map((sprint) => {
				if (sprint.id === request.id) {
					return new SprintImpl(
						sprint.id,
						this.collection.context,
						request.newStartDate === undefined
							? sprint.startDate
							: request.newStartDate,
						request.newEndDate === undefined
							? sprint.endDate
							: request.newEndDate
					);
				}

				return sprint;
			})
			.sort((a, b) =>
				Temporal.PlainDate.compare(a.startDate, b.startDate)
			);

		return new SprintFactory(
			new SprintContextCollectionImpl(context, sprints)
		);
	}

	updateMany(requests: SprintUpdateRequest[]): SprintFactory {
		let factory: SprintFactory = this;
		for (const request of requests) {
			factory = factory.update(request);
		}
		return factory;
	}

	delete(id: SprintId): SprintFactory {
		const context = this.collection.context;
		const sprints = this.collection.sprints.filter(
			(sprint) => sprint.id !== id
		);

		return new SprintFactory(
			new SprintContextCollectionImpl(context, sprints)
		);
	}

	deleteMany(ids: SprintId[]): SprintFactory {
		let factory: SprintFactory = this;
		for (const id of ids) {
			factory = factory.delete(id);
		}
		return factory;
	}

	build(): SprintContextCollection {
		this.validate();
		return this.collection;
	}

	private validate() {
		for (const sprint of this.collection.sprints) {
			if (!sprint.context.equals(this.collection.context)) {
				throw new InvalidSprintContextError(
					'Sprint context does not match collection context'
				);
			}

			if (
				!this.collection.context.doesIncludeDate(sprint.startDate) ||
				!this.collection.context.doesIncludeDate(sprint.endDate)
			) {
				throw new InvalidSprintContextError(
					'Sprint dates must be within context year'
				);
			}

			if (
				this.collection.sprints
					.filter((s) => !s.id.equals(sprint.id))
					.some((s) =>
						s.overlapWithRange(sprint.startDate, sprint.endDate)
					)
			) {
				throw new SprintOverlapError('Two sprints cannot overlap');
			}
		}
	}
}

import { SprintContextCollection } from '../model/SprintContextCollection';
import { ContextYear } from '../../common/model/ContextYear';
import { Sprint } from '../model/Sprint';
import { SprintId } from '../model/SprintId';
import { Temporal } from 'temporal-polyfill';
import { SprintUpdateRequest } from '../model/SprintUpdateRequest';
import { InvalidSprintContextError } from '../error/InvalidSprintContextError';
import { SprintOverlapError } from '../error/SprintOverlapError';

class SprintImpl extends Sprint {
	public setIndex(value: number) {
		super.setIndex(value);
	}
}
class SprintContextCollectionImpl extends SprintContextCollection {
	constructor(context: ContextYear, sprints: ReadonlyArray<SprintImpl>) {
		super(context, sprints);
		for (let i = 0; i < sprints.length; i++) {
			sprints[i].setIndex(i);
		}
	}

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
		const twoWeeksInDays = 14;
		const gaps = this.findAvailableGaps();

		let factory: SprintFactory = this;

		for (const gap of gaps) {
			let currentStart = gap.start;

			while (true) {
				const potentialEnd = currentStart.add({
					days: twoWeeksInDays - 1
				});

				if (Temporal.PlainDate.compare(potentialEnd, gap.end) > 0) {
					break;
				}

				factory = factory.addNewSprint(currentStart, potentialEnd);
				currentStart = potentialEnd.add({ days: 1 });
			}
		}

		return factory;
	}

	createSprint(): SprintFactory {
		const twoWeeksInDays = 14;
		const gaps = this.findAvailableGaps();

		if (gaps.length === 0) {
			return this;
		}

		for (const gap of gaps) {
			const potentialEnd = gap.start.add({ days: twoWeeksInDays - 1 });

			if (Temporal.PlainDate.compare(potentialEnd, gap.end) <= 0) {
				return this.addNewSprint(gap.start, potentialEnd);
			}
		}

		const firstGap = gaps[0];
		return this.addNewSprint(firstGap.start, firstGap.end);
	}

	update(request: SprintUpdateRequest): SprintFactory {
		const context = this.collection.context;
		const sprints = this.collection.sprints
			.map((sprint) => {
				if (sprint.id.equals(request.id)) {
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
			(sprint) => !sprint.id.equals(id)
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

	private findAvailableGaps(): Array<{
		start: Temporal.PlainDate;
		end: Temporal.PlainDate;
	}> {
		const context = this.collection.context;
		const yearStart = Temporal.PlainDate.from({
			year: context.year,
			month: 1,
			day: 1
		});
		const yearEnd = Temporal.PlainDate.from({
			year: context.year,
			month: 12,
			day: 31
		});

		const gaps: Array<{
			start: Temporal.PlainDate;
			end: Temporal.PlainDate;
		}> = [];

		if (this.collection.sprints.length === 0) {
			gaps.push({ start: yearStart, end: yearEnd });
			return gaps;
		}

		const sortedSprints = [...this.collection.sprints].sort((a, b) =>
			Temporal.PlainDate.compare(a.startDate, b.startDate)
		);

		const firstSprintStart = sortedSprints[0].startDate;
		if (Temporal.PlainDate.compare(yearStart, firstSprintStart) < 0) {
			gaps.push({
				start: yearStart,
				end: firstSprintStart.subtract({ days: 1 })
			});
		}

		for (let i = 0; i < sortedSprints.length - 1; i++) {
			const currentEnd = sortedSprints[i].endDate;
			const nextStart = sortedSprints[i + 1].startDate;
			const gapStart = currentEnd.add({ days: 1 });

			if (Temporal.PlainDate.compare(gapStart, nextStart) < 0) {
				gaps.push({
					start: gapStart,
					end: nextStart.subtract({ days: 1 })
				});
			}
		}

		const lastSprintEnd = sortedSprints[sortedSprints.length - 1].endDate;
		const gapStart = lastSprintEnd.add({ days: 1 });
		if (Temporal.PlainDate.compare(gapStart, yearEnd) <= 0) {
			gaps.push({ start: gapStart, end: yearEnd });
		}

		return gaps;
	}

	private addNewSprint(
		start: Temporal.PlainDate,
		end: Temporal.PlainDate
	): SprintFactory {
		const context = this.collection.context;
		const newSprintId = SprintId.random();
		const newSprint = new SprintImpl(newSprintId, context, start, end);

		const newSprints = [...this.collection.sprints, newSprint].sort(
			(a, b) => Temporal.PlainDate.compare(a.startDate, b.startDate)
		);

		return new SprintFactory(
			new SprintContextCollectionImpl(context, newSprints)
		);
	}
}

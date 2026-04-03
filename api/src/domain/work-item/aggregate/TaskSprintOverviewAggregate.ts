import { Task } from '../model/Task';
import { Sprint } from '../../sprint/model/Sprint';
import { LexicalRank } from '../../common/model/LexicalRank';
import { WorkItemStatus } from '../model/WorkItemStatus';
import { WorkItemId } from '../model/WorkItemId';
import { SprintOverviewMoveRequest } from '../model/SprintOverviewMoveRequest';
import { WorkItemNotFoundError } from '../error/WorkItemNotFoundError';
import { SprintWorkItemTimeFrame } from '../model/WorkItemTimeFrame';

export class TaskSprintOverviewAggregate {
	constructor(
		public readonly sprint: Sprint,
		public tasks: Task[]
	) {
		this.tasks.sort((a: Task, b: Task) =>
			LexicalRank.compare(a.sprintOverviewOrder, b.sprintOverviewOrder)
		);
	}

	create(status: WorkItemStatus): void {
		const task = Task.default(this.sprint.context);
		task.status = status;
		task.timeFrame = new SprintWorkItemTimeFrame(
			this.sprint.context,
			this.sprint
		);
		this.tasks.push(task);
	}

	move(request: SprintOverviewMoveRequest): void {
		const task = this.findById(request.id);
		this.fillOrders();
		if (request.order.isFirst()) {
			task.sprintOverviewOrder = LexicalRank.beforeAll(
				this.tasks.map((task) => task.sprintOverviewOrder!)
			);
		} else if (request.order.isLast()) {
			task.sprintOverviewOrder = LexicalRank.afterAll(
				this.tasks.map((task) => task.sprintOverviewOrder!)
			);
		} else if (request.order.isBetween()) {
			task.sprintOverviewOrder = LexicalRank.between(
				this.findById(request.order.after).sprintOverviewOrder!,
				this.findById(request.order.before).sprintOverviewOrder!
			);
		}

		this.tasks.sort((a: Task, b: Task) =>
			LexicalRank.compare(a.sprintOverviewOrder, b.sprintOverviewOrder)
		);
	}

	private findById(id: WorkItemId): Task {
		for (const task of this.tasks) {
			if (task.id.equals(id)) {
				return task;
			}
		}

		throw new WorkItemNotFoundError('Work item not found');
	}

	private fillOrders() {
		this.tasks.sort((a: Task, b: Task) =>
			LexicalRank.compare(a.sprintOverviewOrder, b.sprintOverviewOrder)
		);

		for (let i = 0; i < this.tasks.length; i++) {
			const task = this.tasks[i]!;
			if (task.sprintOverviewOrder) {
				continue;
			}

			if (i === 0) {
				task.sprintOverviewOrder = LexicalRank.single();
			} else {
				const prevTask = this.tasks[i - 1]!;
				task.sprintOverviewOrder = LexicalRank.afterAll([
					prevTask.sprintOverviewOrder!
				]);
			}
		}
	}
}

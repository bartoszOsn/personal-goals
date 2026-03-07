import {
	Column,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn
} from 'typeorm';
import { SprintSettingsEntity } from '../../time/entity/SprintSettingsEntity';
import { ObjectiveEntity } from '../../work/entity/ObjectiveEntity';
import { SprintTimeRangeEntity } from '../../time/entity/SprintTimeRangeEntity';
import { TaskEntity } from '../../work/entity/TaskEntity';
import { WorkItemEntity } from '../../work-item/entity/WorkItemEntity';

@Entity()
export class UserEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	email: string;

	@Column()
	passwordHash: string;

	@OneToMany(() => SprintTimeRangeEntity, (sprint) => sprint.user)
	sprints: SprintTimeRangeEntity[];

	@OneToOne(() => SprintSettingsEntity, (settings) => settings.user)
	sprintSettings?: SprintSettingsEntity;

	@OneToMany(() => ObjectiveEntity, (objective) => objective.user)
	objectives: ObjectiveEntity[];

	@OneToMany(() => TaskEntity, (task) => task.user)
	tasks: TaskEntity[];

	@OneToMany(() => WorkItemEntity, (workItem) => workItem.user)
	workItems: WorkItemEntity[];
}

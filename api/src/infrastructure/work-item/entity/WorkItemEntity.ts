import {
	Column,
	Entity,
	ManyToOne,
	PrimaryColumn,
	Tree,
	TreeChildren,
	TreeParent
} from 'typeorm';
import { UserEntity } from '../../auth/entity/UserEntity';
import { WorkItemTimeFrameEntity } from './WorkItemTimeFrameEntity';

@Entity()
@Tree('closure-table')
export class WorkItemEntity {
	@PrimaryColumn({ type: 'uuid' })
	id!: string;

	@Column({ enum: ['task', 'goal', 'group'] })
	type!: 'task' | 'goal' | 'group';

	@Column()
	contextYear!: number;

	@Column()
	title!: string;

	@Column()
	description!: string;

	@Column({ enum: ['todo', 'inProgress', 'done', 'failed'] })
	status!: 'todo' | 'inProgress' | 'done' | 'failed';

	@Column(() => WorkItemTimeFrameEntity)
	timeFrame!: WorkItemTimeFrameEntity;

	@ManyToOne(() => UserEntity, (user) => user.workItems)
	user!: UserEntity;

	@TreeChildren()
	children?: WorkItemEntity[];

	@TreeParent({ onDelete: 'CASCADE' })
	parent?: WorkItemEntity;

	@Column({ nullable: true })
	hierarchyOrder?: string;

	@Column({ nullable: true })
	sprintOverviewOrder?: string;
}

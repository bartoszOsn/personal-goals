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
import { WorkItemProgressEntity } from './WorkItemProgressEntity';

@Entity()
@Tree('closure-table')
export class WorkItemEntity {
	@PrimaryColumn({ type: 'uuid' })
	id!: string;

	@Column({ enum: ['task', 'objective', 'keyResult'] })
	type!: 'task' | 'objective' | 'keyResult';

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

	@Column(() => WorkItemProgressEntity)
	progress!: WorkItemProgressEntity;

	@ManyToOne(() => UserEntity, (user) => user.workItems)
	user!: UserEntity;

	@TreeChildren()
	children!: WorkItemEntity[];

	@TreeParent({ onDelete: 'CASCADE' })
	parent?: WorkItemEntity;
}

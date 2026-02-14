import {
	Column,
	Entity,
	ManyToOne,
	ManyToMany,
	JoinTable,
	PrimaryColumn
} from 'typeorm';
import { UserEntity } from '../../auth/entity/UserEntity';
import { SprintTimeRangeEntity } from '../../time/entity/SprintTimeRangeEntity';

@Entity()
export class TaskEntity {
	@PrimaryColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column('text')
	description: string;

	@Column()
	status: string;

	@Column({ nullable: true })
	startDate: string | null;

	@Column({ nullable: true })
	endDate: string | null;

	@ManyToMany(() => SprintTimeRangeEntity)
	@JoinTable()
	sprints: SprintTimeRangeEntity[];

	@ManyToOne(() => UserEntity, (user) => user.tasks)
	user: UserEntity;
}

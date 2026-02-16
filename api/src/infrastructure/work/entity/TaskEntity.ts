import {
	Column,
	Entity,
	ManyToOne,
	ManyToMany,
	JoinTable,
	PrimaryColumn,
	PrimaryGeneratedColumn
} from 'typeorm';
import { UserEntity } from '../../auth/entity/UserEntity';
import { SprintTimeRangeEntity } from '../../time/entity/SprintTimeRangeEntity';

@Entity()
export class TaskEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column('text')
	description: string;

	@Column()
	status: string;

	@Column({ nullable: true })
	startDate?: string;

	@Column({ nullable: true })
	endDate?: string;

	@ManyToMany(() => SprintTimeRangeEntity)
	@JoinTable()
	sprints: SprintTimeRangeEntity[];

	@ManyToOne(() => UserEntity, (user) => user.tasks)
	user: UserEntity;
}

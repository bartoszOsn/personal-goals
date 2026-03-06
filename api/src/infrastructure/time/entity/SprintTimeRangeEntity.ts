import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn
} from 'typeorm';
import { UserEntity } from '../../auth/entity/UserEntity';
import { WorkItemEntity } from '../../../v2/inffrastructure/entity/WorkItemEntity';

@Entity()
export class SprintTimeRangeEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	startDate: string;

	@Column()
	endDate: string;

	@ManyToOne(() => UserEntity, (user) => user.sprints)
	user: UserEntity;

	@OneToMany(() => WorkItemEntity, (wi) => wi.timeFrame.sprint)
	timeFrames: WorkItemEntity[];
}

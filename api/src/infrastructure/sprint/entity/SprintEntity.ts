import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../../auth/entity/UserEntity';
import { WorkItemEntity } from '../../work-item/entity/WorkItemEntity';

@Entity()
export class SprintEntity {
	@PrimaryColumn('uuid')
	id: string;

	@Column()
	context: number;

	@Column()
	startDate: string;

	@Column()
	endDate: string;

	@ManyToOne(() => UserEntity, (user) => user.sprints)
	user: UserEntity;

	@OneToMany(() => WorkItemEntity, (workItem) => workItem.timeFrame.sprint)
	timeFrames: WorkItemEntity[];
}

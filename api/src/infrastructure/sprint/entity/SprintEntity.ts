import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../../auth/entity/UserEntity';
import { WorkItemEntityOld } from '../../work-item/entity/WorkItemEntityOld';

@Entity()
export class SprintEntity {
	@PrimaryColumn('uuid')
	id!: string;

	@Column()
	context!: number;

	@Column()
	startDate!: string;

	@Column()
	endDate!: string;

	@ManyToOne(() => UserEntity, (user) => user.sprints)
	user!: UserEntity;

	@OneToMany(() => WorkItemEntityOld, (workItem) => workItem.timeFrame.sprint)
	timeFrames!: WorkItemEntityOld[];
}

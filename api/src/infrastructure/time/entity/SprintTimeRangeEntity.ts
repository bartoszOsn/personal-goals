import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../auth/entity/UserEntity';

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
}

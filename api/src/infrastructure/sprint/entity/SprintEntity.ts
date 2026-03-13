import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../../auth/entity/UserEntity';

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
}

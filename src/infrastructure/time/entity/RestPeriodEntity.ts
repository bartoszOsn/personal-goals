import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn
} from 'typeorm';
import { UserEntity } from '../../auth/entity/UserEntity';

@Entity()
export class RestPeriodEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ nullable: true })
	name?: string;

	@Column()
	start: Date;

	@Column()
	end: Date;

	@ManyToOne(() => UserEntity, (entity) => entity.restPeriods, {
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	user: UserEntity;
}

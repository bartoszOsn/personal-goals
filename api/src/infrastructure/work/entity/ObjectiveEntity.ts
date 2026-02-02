import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn
} from 'typeorm';
import { UserEntity } from '../../auth/entity/UserEntity';
import { KeyResultEntity } from './KeyResultEntity';

@Entity()
export class ObjectiveEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	description: string;

	@Column()
	deadlineYear: number;

	@Column({ nullable: true })
	deadlineQuarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4';

	@ManyToOne(() => UserEntity, (user: UserEntity) => user.objectives)
	@JoinColumn()
	user: UserEntity;

	@OneToMany(() => KeyResultEntity, (keyResult) => keyResult.objective)
	keyResults: KeyResultEntity[];
}

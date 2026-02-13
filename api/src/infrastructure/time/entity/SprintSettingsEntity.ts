import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn
} from 'typeorm';
import { UserEntity } from '../../auth/entity/UserEntity';

@Entity()
export class SprintSettingsEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	sprintDuration: 'week' | 'two-weeks' | 'month';

	@Column()
	quarterAssignment: 'beginning' | 'end' | 'by-majority';

	@Column()
	generateUntil: string;

	@OneToOne(() => UserEntity, (user: UserEntity) => user.id)
	@JoinColumn()
	user: UserEntity;
}

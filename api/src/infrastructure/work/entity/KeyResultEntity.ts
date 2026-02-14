import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn
} from 'typeorm';
import { ObjectiveEntity } from './ObjectiveEntity';

@Entity()
export class KeyResultEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	description: string;

	@Column()
	progress: number;

	@ManyToOne(() => ObjectiveEntity, (objective) => objective.keyResults, {
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	objective: ObjectiveEntity;
}

import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn
} from 'typeorm';
import { ObjectiveEntity } from './ObjectiveEntity';
import { TaskEntity } from './TaskEntity';

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

	@Column()
	progressCalculationType: 'YES_NO' | 'PERCENTAGE' | 'TASKS';

	@ManyToOne(() => ObjectiveEntity, (objective) => objective.keyResults, {
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	objective: ObjectiveEntity;

	@OneToMany(() => TaskEntity, (task) => task.keyResult)
	associatedTasks: TaskEntity[];
}

import {
	Column,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn
} from 'typeorm';
import { SprintSettingsEntity } from '../../time/entity/SprintSettingsEntity';
import { ObjectiveEntity } from '../../work/entity/ObjectiveEntity';
import { SprintTimeRangeEntity } from '../../time/entity/SprintTimeRangeEntity';

@Entity()
export class UserEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	email: string;

	@Column()
	passwordHash: string;

	@OneToMany(() => SprintTimeRangeEntity, (sprint) => sprint.user)
	sprints: SprintTimeRangeEntity[];

	@OneToOne(() => SprintSettingsEntity, (settings) => settings.user)
	sprintSettings?: SprintSettingsEntity;

	@OneToMany(() => ObjectiveEntity, (objective) => objective.user)
	objectives: ObjectiveEntity[];
}

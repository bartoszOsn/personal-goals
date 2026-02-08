import { Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SprintSettingsEntity } from '../../time/entity/SprintSettingsEntity';
import { ObjectiveEntity } from '../../work/entity/ObjectiveEntity';

@Entity()
export class UserEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@OneToOne(() => SprintSettingsEntity, (settings) => settings.user)
	sprintSettings?: SprintSettingsEntity;

	@OneToMany(() => ObjectiveEntity, (objective) => objective.user)
	objectives: ObjectiveEntity[];
}

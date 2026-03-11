import {
	Column,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn
} from 'typeorm';
import { SprintSettingsEntity } from '../../time/entity/SprintSettingsEntity';
import { SprintTimeRangeEntity } from '../../time/entity/SprintTimeRangeEntity';
import { WorkItemEntity } from '../../work-item/entity/WorkItemEntity';

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

	@OneToMany(() => WorkItemEntity, (workItem) => workItem.user)
	workItems: WorkItemEntity[];
}

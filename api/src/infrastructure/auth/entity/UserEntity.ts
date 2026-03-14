import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkItemEntity } from '../../work-item/entity/WorkItemEntity';
import { SprintEntity } from '../../sprint/entity/SprintEntity';
import { DocumentEntity } from '../../document/entity/DocumentEntity';

@Entity()
export class UserEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	email: string;

	@Column()
	passwordHash: string;

	@OneToMany(() => SprintEntity, (sprint) => sprint.user)
	sprints: SprintEntity[];

	@OneToMany(() => WorkItemEntity, (workItem) => workItem.user)
	workItems: WorkItemEntity[];

	@OneToMany(() => DocumentEntity, (document) => document.user)
	documents: DocumentEntity[];
}

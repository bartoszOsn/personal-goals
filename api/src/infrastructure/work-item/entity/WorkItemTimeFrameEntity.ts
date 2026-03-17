import { Column, ManyToOne } from 'typeorm';
import { SprintEntity } from '../../sprint/entity/SprintEntity';

export class WorkItemTimeFrameEntity {
	@Column({ enum: ['null', 'wholeYear', 'quarter', 'customDate', 'sprint'] })
	type!: 'null' | 'wholeYear' | 'quarter' | 'customDate' | 'sprint';

	// For quarter
	@Column({ enum: [1, 2, 3, 4], nullable: true })
	quarter?: 1 | 2 | 3 | 4;

	// For custom date
	@Column({ nullable: true })
	startDate?: string;

	@Column({ nullable: true })
	endDate?: string;

	// For sprint
	@ManyToOne(() => SprintEntity, (sprint) => sprint.timeFrames, {
		nullable: true,
		onDelete: 'RESTRICT'
	})
	sprint?: SprintEntity | null;
}

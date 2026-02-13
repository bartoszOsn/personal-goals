import { QuarterDTO } from './QuarterDTO';

export interface SprintDTO {
	readonly id: string;
	readonly year: number;
	readonly quarter: QuarterDTO;
	readonly yearlyIndex: number;
	readonly startDate: string;
	readonly endDate: string;
	readonly status: 'completed' | 'active' | 'future';
}

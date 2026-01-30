import { QuarterDTO } from './QuarterDTO';

export interface SprintDTO {
	readonly year: number;
	readonly quarter: QuarterDTO;
	readonly yearlyIndex: number;
	readonly startDate: Date;
	readonly endDate: Date;
}

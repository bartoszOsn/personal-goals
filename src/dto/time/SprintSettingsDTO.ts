export interface SprintSettingsDTO {
	sprintDuration: 'week' | 'two-weeks' | 'month'; // TODO: remove
	quarterAssignment: 'beginning' | 'end' | 'by-majority';
	generateUntil: string; // TODO: remove
}

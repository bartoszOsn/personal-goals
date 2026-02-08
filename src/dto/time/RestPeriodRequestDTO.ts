import { RestPeriodDTO } from './RestPeriodDTO';

export type RestPeriodRequestDTO = Omit<RestPeriodDTO, 'id'>;

import { GenericService } from 'src/Application/Repositories';
import { PatientResponse, PaymentOptionsResponse } from './Responses';

export interface IPaymentOptionsService {
  GenericService: GenericService<unknown, unknown>;
  paymentIsCash(id: number): Promise<boolean>;
  getById(id: number): Promise<PaymentOptionsResponse | null>;
}

export interface IPatientService {
  GenericService: GenericService<unknown, unknown>;
  findByIdentification(identification: string): Promise<PatientResponse | null>;
}

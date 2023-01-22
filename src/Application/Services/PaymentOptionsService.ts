import { IPaymentOptions } from 'src/Domine/ModelsDB';
import { IRepository } from '../Repositories/Interface';
import { PaymentOptionsResponse } from 'src/Domine/Responses';
import { PaymentOptionsRepository } from '../Repositories';

export class PaymentOptionsService {
  private repository: IRepository<IPaymentOptions, PaymentOptionsResponse>;
  private allPaymentOptions: Array<PaymentOptionsResponse>;
  private static instance: PaymentOptionsService;

  private constructor() {
    this.repository = new PaymentOptionsRepository();
    this.allPaymentOptions = [];
    return;
  }

  public static getInstance(): PaymentOptionsService {
    if (!PaymentOptionsService.instance) {
      PaymentOptionsService.instance = new PaymentOptionsService();
    }
    return PaymentOptionsService.instance;
  }

  public async findByParameters(
    queryParameters: object
  ): Promise<Array<PaymentOptionsResponse>> {
    const response = await this.repository.findByParameters(queryParameters);
    if (response == null || response.length === 0) return [];
    return response;
  }

  public async getAll(): Promise<Array<PaymentOptionsResponse>> {
    if (this.allPaymentOptions.length !== 0) {
      return this.allPaymentOptions;
    }
    const response = await this.repository.getAll();
    if (response == null) return [];
    this.allPaymentOptions = response;
    return response;
  }

  public async getById(id: number): Promise<PaymentOptionsResponse | null> {
    const response = await this.repository.getById(id);
    return response;
  }

  public setRepository(
    repository: IRepository<IPaymentOptions, PaymentOptionsResponse>
  ) {
    this.repository = repository;
  }
}

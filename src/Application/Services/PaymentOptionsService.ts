import { IPaymentOptions } from 'src/Domine/ModelsDB';
import { Repository } from '../Repositories/Interface';
import { PaymentOptionsResponse } from 'src/Domine/Responses';
import { PaymentOptionsRepository } from '../Repositories';

export class PaymentOptionsService {
  private repository: Repository<IPaymentOptions>;
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

  public async paymentIsCash(id: number): Promise<boolean> {
    const allPaymentOptions = await this.getAll();
    const result = allPaymentOptions.filter(
      (po) => po.description == 'Efectivo'
    );
    const cash = result.pop();
    if (cash?.id !== id) {
      return false;
    }
    return true;
  }

  public setRepository(
    repository: IRepository<IPaymentOptions, PaymentOptionsResponse>
  ) {
    this.repository = repository;
  }
}

import { IPaymentOptions } from 'src/Domine/ModelsDB';
import { Repository, Service } from '../Repositories/Interface';
import { PaymentOptionsResponse } from 'src/Domine/Responses';
import { PaymentOptionsRepository } from '../Repositories';
import HttpStatusCodes from '../Utilities/HttpStatusCodes';

export class PaymentOptionsService extends Service<
  IPaymentOptions,
  PaymentOptionsResponse
> {
  public repository: Repository<IPaymentOptions>;
  private allPaymentOptions: Array<PaymentOptionsResponse>;
  private static instance: PaymentOptionsService;

  public constructor() {
    super();
    this.repository = new PaymentOptionsRepository();
    this.allPaymentOptions = [];
  }

  public static getInstance(): PaymentOptionsService {
    if (!PaymentOptionsService.instance) {
      PaymentOptionsService.instance = new PaymentOptionsService();
    }
    return PaymentOptionsService.instance;
  }

  // public async findByParameters(
  //   queryParameters: object
  // ): Promise<Array<PaymentOptionsResponse>> {
  //   const response = await this.repository.findByParameters(queryParameters);
  //   if (!response.ok || response.status == HttpStatusCodes.NO_CONTENT)
  //     return [];
  //   return await response.json();
  // }

  public override async getAll(): Promise<Array<PaymentOptionsResponse>> {
    if (this.allPaymentOptions.length !== 0) {
      return this.allPaymentOptions;
    }
    const response = await this.repository.getAll();
    if (!response.ok) return [];
    this.allPaymentOptions = await response.json();
    return this.allPaymentOptions;
  }

  public async getById(id: number): Promise<PaymentOptionsResponse | null> {
    const response = await this.repository.getById(id);
    return await response.json();
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
}

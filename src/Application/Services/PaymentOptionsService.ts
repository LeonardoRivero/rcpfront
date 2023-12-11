import { IPaymentOptions } from 'src/Domine/ModelsDB';
import { GenericService } from '../Repositories/Interface';
import { PaymentOptionsResponse } from 'src/Domine/Responses';
import { IPaymentOptionsService } from 'src/Domine/IServices';
import 'reflect-metadata';
import { injectable } from 'inversify';
export class PaymentOptionsGenericService extends GenericService<
  IPaymentOptions,
  PaymentOptionsResponse
> {
  urlCreate: string;
  urlList: string;
  urlBase: string;
  urlUpdate: string;

  public constructor() {
    super();
    const urlAPI = process.env.PAYMENT_OPTIONS
      ? process.env.PAYMENT_OPTIONS
      : '';
    this.urlBase = `${process.env.RCP}${urlAPI}`;
    this.urlCreate = `${this.urlBase}all/`;
    this.urlList = `${this.urlBase}all/`;
    this.urlUpdate = this.urlBase;
  }
}

@injectable()
export class PaymentOptionsService implements IPaymentOptionsService {
  GenericService: GenericService<IPaymentOptions, PaymentOptionsResponse>;
  private allPaymentOptions: Array<PaymentOptionsResponse>;
  constructor() {
    this.GenericService = new PaymentOptionsGenericService();
    this.allPaymentOptions = [];
  }

  async paymentIsCash(id: number): Promise<boolean> {
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

  async getById(id: number): Promise<PaymentOptionsResponse | null> {
    const url = `${this.GenericService.urlBase}${id}/`;
    const response = await this.GenericService.httpClient.GET(url);
    return await response.json();
  }

  public async getAll(): Promise<Array<PaymentOptionsResponse>> {
    if (this.allPaymentOptions.length !== 0) {
      return this.allPaymentOptions;
    }
    const response = await this.GenericService.httpClient.GET(
      this.GenericService.urlList
    );
    if (!response.ok) return [];
    this.allPaymentOptions = await response.json();
    return this.allPaymentOptions;
  }
}

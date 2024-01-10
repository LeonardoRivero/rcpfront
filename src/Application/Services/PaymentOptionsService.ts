import { IPaymentOptions } from 'src/Domine/ModelsDB';
import { GenericService } from '../Repositories/Interface';
import { PaymentOptionsResponse } from 'src/Domine/Responses';
import 'reflect-metadata';
import { injectable } from 'inversify';
import { UseCase } from 'src/Domine/IPatterns';
export class PaymentOptionsService extends GenericService<
  IPaymentOptions,
  PaymentOptionsResponse
> {
  urlCreate: string;
  urlList: string;
  urlBase: string;
  urlUpdate: string;
  private allPaymentOptions: Array<PaymentOptionsResponse>;

  public constructor() {
    super();
    const urlAPI = process.env.PAYMENT_OPTIONS
      ? process.env.PAYMENT_OPTIONS
      : '';
    this.urlBase = `${process.env.RCP}${urlAPI}`;
    this.urlCreate = `${this.urlBase}all/`;
    this.urlList = `${this.urlBase}list/`;
    this.urlUpdate = this.urlBase;
    this.allPaymentOptions = [];
  }

  public override async getById(
    id: number
  ): Promise<PaymentOptionsResponse | null> {
    const url = `${this.urlBase}${id}/`;
    const response = await this.httpClient.GET(url);
    return await response.json();
  }

  public async getAll(): Promise<Array<PaymentOptionsResponse>> {
    if (this.allPaymentOptions.length !== 0) {
      return this.allPaymentOptions;
    }
    const response = await this.httpClient.GET(this.urlList);
    if (!response.ok) return [];
    this.allPaymentOptions = await response.json();
    return this.allPaymentOptions;
  }
}

// @injectable()
export class PaymentOptionIsCashUseCase implements UseCase<number, boolean> {
  GenericService: GenericService<IPaymentOptions, PaymentOptionsResponse>;

  constructor() {
    this.GenericService = new PaymentOptionsService();
  }
  async execute(id: number): Promise<boolean> {
    const allPaymentOptions = await this.GenericService.getAll();
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

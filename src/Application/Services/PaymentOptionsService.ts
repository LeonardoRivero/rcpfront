import { IPaymentOptions } from 'src/Domine/Request';
import { GenericService } from '../Repositories/Interface';
import { PaymentOptionsResponse } from 'src/Domine/Responses';
import { IUseCase, UseCase } from 'src/Domine/IPatterns';
// export class PaymentOptionsService extends GenericService<
//   IPaymentOptions,
//   PaymentOptionsResponse
// > {
//   urlCreate: string;
//   urlList: string;
//   urlBase: string;
//   urlUpdate: string;
//   private allPaymentOptions: Array<PaymentOptionsResponse>;

//   public constructor() {
//     super();
//     const urlAPI = process.env.PAYMENT_OPTIONS
//       ? process.env.PAYMENT_OPTIONS
//       : '';
//     this.urlBase = `${process.env.RCP}${urlAPI}`;
//     this.urlCreate = `${this.urlBase}all/`;
//     this.urlList = `${this.urlBase}list/`;
//     this.urlUpdate = this.urlBase;
//     this.allPaymentOptions = [];
//   }

//   public override async getById(
//     id: number
//   ): Promise<PaymentOptionsResponse | null> {
//     const url = `${this.urlBase}${id}/`;
//     const response = await this.httpClient.GET(url);
//     return await response.json();
//   }

//   public async getAll(): Promise<Array<PaymentOptionsResponse>> {
//     if (this.allPaymentOptions.length !== 0) {
//       return this.allPaymentOptions;
//     }
//     const response = await this.httpClient.GET(this.urlList);
//     if (!response.ok) return [];
//     this.allPaymentOptions = await response.json();
//     return this.allPaymentOptions;
//   }
// }

// @injectable()


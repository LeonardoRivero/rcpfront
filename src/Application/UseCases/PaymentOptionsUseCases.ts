import { PaymentOptionsResponse, ResponseData } from 'src/Domine/Responses';
import { HTTPClient, IHandleGlobalState, IUseCase } from 'src/Domine/IPatterns';

export class GetAllPaymentOptionUseCase implements IUseCase<void, PaymentOptionsResponse[]> {
  url: string
  constructor(private httpClient: HTTPClient) {
    this.url = `${process.env.RCP}${process.env.PAYMENT_OPTIONS}`;
  }
  async execute(): Promise<PaymentOptionsResponse[]> {
    const response = await this.httpClient.GET(this.url)
    if (!response.ok) {
      return []
    }
    const responseAsJson: ResponseData<PaymentOptionsResponse[]> = await response.json()
    return responseAsJson.result
  }

}


export class PaymentOptionIsCashUseCase implements IUseCase<number, boolean> {

  constructor(private handleGlobalState: IHandleGlobalState) {
  }
  async execute(id: number): Promise<boolean> {

    const allPaymentOptions = await this.handleGlobalState.getAllPaymentOptions()
    const result = allPaymentOptions.filter((po) => po.description == 'Efectivo');
    const cash = result.pop();
    return cash?.id === id
  }
}
